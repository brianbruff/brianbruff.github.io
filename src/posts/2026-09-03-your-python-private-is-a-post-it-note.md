---
title: "Your Python Private Is a Post-it Note"
date: "2026-09-03"
category: "Security"
tags: ["python", "security", "ai agents", "sandboxing"]
image: "/images/python-security-1-hero.jpg"
---

![An ornate brass padlock hanging on a workshop door that stands ajar, its hinges unscrewed and lying on the bench](/images/python-security-1-hero.jpg)

You are building something that runs code you did not write. A plugin host. A notebook kernel. An AI agent with a Python tool. The untrusted side needs to call your API, so you hand it a client object with the credential already inside, and you tell yourself the credential is fine because you named it `_auth`.

Then the model writes `print(client.__dict__)` while poking around, and your service account password is in a transcript.

That is not a hypothetical failure mode; it is the *first* thing exploratory code does to an unfamiliar object. So you fix it. And then you fix the fix. This post is the four rounds that follow, each one a defence I have watched capable engineers write, and each one paired with the line that ends it.

Every code sample here comes from [brianbruff/python-security-intro](https://github.com/brianbruff/python-security-intro), eight runnable lessons you can execute in order. **Every block of output below is real** — captured from those scripts on CPython 3.14, not typed out to make a point.

## The claim, stated once

> In-process Python privacy is advisory. It stops code that is not trying to get in, and it stops nothing else.

Two things this post is *not* about. It is not about pickle deserialisation, `eval`, or supply-chain attacks — those are different problems with their own literature. And it is not an argument that you should stop writing underscores. The argument is narrower and more useful: **know which of your defences are hygiene and which are boundaries**, because confusing the two is how credentials end up in logs.

## Round 1 — The underscore

The starting position. A client holds a credential, spelled with the conventions Python gives you for saying "not yours".

<div class="duel">
<div class="duel__side duel__side--armour">
<p class="duel__label">The defence</p>

```python
class Client:
    def __init__(self, url, user, pw):
        self.base_url = url
        self._auth = (user, pw)    # a polite note
        self.__token = "tok_abc"   # name mangling
```

</div>
<div class="duel__side duel__side--bypass">
<p class="duel__label">The line that ends it</p>

```python
>>> client.__dict__
```

<p>Not an exploit. The single most common thing anyone — or any model — types at an unfamiliar object.</p>

</div>
</div>

```text
client.__dict__ = {'base_url': 'https://api.example.com',
                   '_auth': ('svc_user', 'hunter2'),
                   '_Client__token': 'tok_abc123'}
```

`self.x = 1` is not a declaration. It is a key being written into a plain dictionary that anybody holding the object can read, and `vars()` will enumerate it without you needing to know a single attribute name.

The double underscore deserves its own sentence, because it is the most widely misunderstood construct in the language. It is **not** privacy. It is a rename — the compiler rewrites `self.__token` to `self._Client__token` so that a subclass cannot collide with it. That is the entire feature:

```text
>>> client.__token
AttributeError: 'Client' object has no attribute '__token'
>>> client._Client__token
'tok_abc123'
```

Name mangling protects you from an accidental subclass. It has never protected you from a reader.

## Round 2 — The closure

![A sealed glass vial with a copper cap holding a folded paper slip, a brass key lying unlabelled beside it](/images/python-security-2-cell.jpg)

So stop putting the credential on the object. Make it a local of `__init__` and let a nested function capture it. A local normally dies when the call returns — but a nested function that *mentions* it keeps it alive in a `cell` attached to the function, and that cell is not on the instance.

This is real progress, and it is worth understanding why. Where a value lives determines who can reach it:

| Where it lives | Reachable by | Survives the call |
|---|---|---|
| `self._auth` — instance attribute | anyone holding the object | yes |
| a plain function local | nobody, ever | no |
| a closure cell | anyone holding **the function** | yes |

The closure is the only one of the three that both survives and is not simply enumerable. So:

<div class="duel">
<div class="duel__side duel__side--armour">
<p class="duel__label">The defence</p>

```python
class ClosureClient:
    def __init__(self, url, user, pw):
        _auth = (user, pw)     # local, NOT self._auth

        def _request(method, path):
            return requests.request(
                method, ..., auth=_auth)

        self._request = _request   # the one door
        self.base_url = url
```

</div>
<div class="duel__side duel__side--bypass">
<p class="duel__label">The line that ends it</p>

```python
>>> client._request.__closure__[0].cell_contents
('svc_user', 'hunter2')
```

<p>The credential is not on the instance. The <em>function</em> is, and the function is the door.</p>

</div>
</div>

The naive read genuinely fails now — `client._auth` raises `AttributeError`, and not because access is forbidden but because there is no such attribute. `print(client.__dict__)`, the thing that burned us in round 1, no longer returns a password. If your threat model is "an LLM prints the object into a report", you have actually fixed it.

But look at what the dict does return:

```text
client.__dict__ = {
    '_request': <function ClosureClient.__init__.<locals>._request
                 at 0x109f5eae0>,
    'base_url': 'https://api.example.com/analytics'}
```

There is the door, handed over by name. And reading a closure needs no guesswork about indexes, because the function carries the names too:

```python
def read_closure(fn):
    """Pair a function's captured names to their current values."""
    return {
        name: cell.cell_contents
        for name, cell in zip(fn.__code__.co_freevars,
                              fn.__closure__ or ())
    }
```

```text
>>> read_closure(client._request)
{'_auth': ('svc_user', 'hunter2'),
 '_base': 'https://api.example.com/analytics'}
```

Six lines, no special knowledge, and it works on any closure you will ever meet. A closure hides a value from *attribute reads*. It does not hide it from anyone holding the function.

## Round 3 — The armour

![A miniature brass vault door standing free on a workbench, with no wall attached to either side](/images/python-security-3-armour.jpg)

The diagnosis from round 2 is precise, so the fix is obvious: make the function unreachable by name. `__getattribute__` runs on *every* attribute read, so override it and you decide which names exist at all — including `__dict__`, which is itself just an attribute read and can therefore be faked.

```python
_ALLOWED = frozenset({"get", "base_url"})

class ArmoredClient:
    def __init__(self, base_url, username, password):
        _auth = (username, password)

        def _request(method, path):
            return f"{method} {base_url}/{path} as {_auth[0]}"

        object.__setattr__(self, "_request", _request)
        object.__setattr__(self, "base_url", base_url)

    def __getattribute__(self, name):
        if name in _ALLOWED or name in {"__repr__", "__str__", "__class__"}:
            return object.__getattribute__(self, name)
        if name == "__dict__":                       # a lie, told deliberately
            return {"base_url": object.__getattribute__(self, "base_url")}
        raise AttributeError(
            f"Access to '{name}' is not available. Use .get(path)."
        )

    def __setattr__(self, name, value):
        raise AttributeError("ArmoredClient attributes are read-only.")

    def get(self, path=""):
        fn = object.__getattribute__(self, "_request")   # ← remember this line
        return fn("GET", path)
```

And it works. Every ordinary route is closed:

```text
Still works:  GET https://api.example.com/analytics/positions as svc_user
Safe to print: ArmoredClient(base_url='https://api.example.com/analytics')

  client._auth      -> AttributeError: Access to '_auth' is not available. Use .get(path).
  client._request   -> AttributeError: Access to '_request' is not available. Use .get(path).
  client.__dict__   -> {'base_url': 'https://api.example.com/analytics'}
  client.password   -> AttributeError: Access to 'password' is not available. Use .get(path).
  vars(client)      -> {'base_url': 'https://api.example.com/analytics'}
  assignment        -> AttributeError: ArmoredClient attributes are read-only.
```

This is where a lot of real code stops, and it is easy to see why. The attribute surface is closed, `vars()` lies, assignment raises, and the repr is safe to log. It looks airtight.

<details class="reveal">
<summary>Before you scroll: how would you break this?</summary>
<div class="reveal__body">

Three hints, in descending order of how much they give away.

1. `__getattribute__` is not the machinery. It is a hook the machinery calls.
2. There is a line in `get()` marked with an arrow above.
3. Attribute access is not the only way to reach an object from another object.

</div>
</details>

## The bypass

![Three keys of completely different design — a cylinder key, a warded key, and a bent copper wire — all pointing at the same keyhole](/images/python-security-4-routes.jpg)

`client._auth` is sugar for `type(client).__getattribute__(client, "_auth")`. Overriding that dunder changes *which function the sugar reaches*. It does not, and cannot, change the machinery underneath — `object.__getattribute__` is a plain builtin sitting in scope, and it never consults the override.

Worse for the defender: the class itself depends on that. Look again at the arrowed line in `get()`. `ArmoredClient` cannot function without raw access to its own attributes, so the escape hatch is not merely available, it is *load-bearing*.

<div class="figure">
<figure>
<svg viewBox="0 0 760 214" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Three routes — object.__getattribute__, the real __dict__, and gc.get_referents — all pass the __getattribute__ barrier and converge on the _request function object, which holds the credential in its closure cell.">
  <text class="f-label" x="8" y="16">Three routes, one destination</text>
  <text class="f-node" x="8" y="70">object.__getattribute__</text>
  <text class="f-node" x="8" y="124">__dict__ (the real one)</text>
  <text class="f-node" x="8" y="178">gc.get_referents</text>
  <text class="f-label" x="272" y="34" text-anchor="middle">__getattribute__</text>
  <line x1="272" y1="46" x2="272" y2="198" stroke="#b26a3c" stroke-width="1" stroke-dasharray="3 5"/>
  <line class="f-route" x1="206" y1="64" x2="420" y2="112" stroke="#e39b4a" stroke-width="1.5"/>
  <line class="f-route f-route--2" x1="206" y1="118" x2="420" y2="120" stroke="#e39b4a" stroke-width="1.5"/>
  <line class="f-route f-route--3" x1="206" y1="172" x2="420" y2="128" stroke="#e39b4a" stroke-width="1.5"/>
  <rect x="428" y="96" width="132" height="48" fill="none" stroke="#b26a3c" stroke-width="1"/>
  <text class="f-node" x="494" y="118" text-anchor="middle">_request</text>
  <text class="f-note" x="494" y="135" text-anchor="middle">function object</text>
  <line x1="560" y1="120" x2="596" y2="120" stroke="#b26a3c" stroke-width="1"/>
  <path d="M600 120 L590 115 L590 125 Z" fill="#b26a3c"/>
  <rect x="604" y="96" width="148" height="48" fill="none" stroke="#d93b2b" stroke-width="1"/>
  <text class="f-note f-hot" x="678" y="116" text-anchor="middle">__closure__[0]</text>
  <text class="f-note f-hot" x="678" y="134" text-anchor="middle">('svc_user', 'hunter2')</text>
</svg>
<figcaption>The armour is a barrier that three different mechanisms simply do not consult. The defender has to close every route; the reader needs one.</figcaption>
</figure>
</div>

Three routes, different in kind. Any one of them is enough.

<div class="duel">
<div class="duel__side duel__side--armour">
<p class="duel__label">Route 1 — the class's own escape hatch</p>

```python
fn = object.__getattribute__(client, "_request")
read_closure(fn)
```

</div>
<div class="duel__side duel__side--bypass">
<p class="duel__label">Result</p>

```text
{'_auth': ('svc_user', 'hunter2'),
 '_base': 'https://api.example.com/analytics'}
```

</div>
</div>

<div class="duel">
<div class="duel__side duel__side--armour">
<p class="duel__label">Route 2 — ask for the real dict, not the fake</p>

```python
real = object.__getattribute__(client, "__dict__")
read_closure(real["_request"])
```

</div>
<div class="duel__side duel__side--bypass">
<p class="duel__label">Result</p>

```text
keys: ['_request', 'base_url']
{'_auth': ('svc_user', 'hunter2'),
 '_base': 'https://api.example.com/analytics'}
```

</div>
</div>

<div class="duel">
<div class="duel__side duel__side--armour">
<p class="duel__label">Route 3 — no attribute access at all</p>

```python
import gc
# what does this object point at?
gc.get_referents(client)
```

</div>
<div class="duel__side duel__side--bypass">
<p class="duel__label">Result</p>

```text
{'_auth': ('svc_user', 'hunter2'),
 '_base': 'https://api.example.com/analytics'}
```

</div>
</div>

Route 3 is the one that should settle the argument. It never touches an attribute, so there is no hook to override. It asks the garbage collector what this object refers to, and the garbage collector answers, because that is its job.

And the list does not end there — `sys._getframe`, `__reduce_ex__`, `ctypes`, and subclassing are all sitting in the same interpreter. This is the asymmetry that makes the whole approach unsalvageable: **the defender must close every route, and the reader needs to find one.**

## The attack surface, on one page

| Mechanism | What it actually stops | What walks through it | Cost to the reader |
|---|---|---|---|
| `_single` underscore | nothing; it is documentation | any read at all | zero |
| `__double` underscore | a subclass name collision | `obj._Class__name` | zero |
| Closure cell | attribute reads for the value | `fn.__closure__[i].cell_contents` | one line |
| `__getattribute__` armour | every *ordinary* attribute read | `object.__getattribute__` | one line |
| ...and its fake `__dict__` | `vars()`, casual introspection | the real `__dict__`, same way | one line |
| All of the above at once | accidents, logs, tracebacks, reports | `gc.get_referents` — no attributes involved | one line |
| **A process boundary** | **reads of a secret that is not there** | **nothing in the language** | **n/a** |

## Why this is settled, not controversial

None of this is a novel finding. Victor Stinner retired `pysandbox` in 2013 having concluded the design was fundamentally broken, and the reason generalises well beyond that project: you cannot sandbox untrusted Python inside a trusted process. CPython deliberately hands running code the raw machinery — that reflective power is a feature the entire ecosystem is built on, and it cannot be selectively withdrawn from one caller.

Which means the question was never "how do I hide this well enough". It was **who can run code in this interpreter**, and the answer determines everything else.

## Where the boundary actually goes

![A brass and glass bank teller's window at night, a paper docket sitting in the pass-through tray](/images/python-security-5-boundary.jpg)

Every defence above failed for one shared reason: the credential and the untrusted code were in the same interpreter. So stop sharing the interpreter.

The move is to give the untrusted side a **handle, not a secret**. The object it holds keeps the same `.get(path)` API, but there is nothing inside it worth stealing — the credential lives on the other side of a boundary the language cannot reach across. And that far side is also the right place for the path policy, because it is the side that can actually be trusted to apply it.

<div class="figure">
<figure>
<svg viewBox="0 0 760 250" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A sandbox process holding a client with only a base URL and a channel; a request crosses the process boundary to a trusted broker that holds the credential and the path policy. The credential never crosses back.">
  <text class="f-label" x="8" y="22">Untrusted process</text>
  <text class="f-label" x="752" y="22" text-anchor="end">Trusted process</text>
  <rect x="8" y="40" width="200" height="90" fill="none" stroke="#b26a3c" stroke-width="1"/>
  <text class="f-node" x="24" y="66">SandboxClient</text>
  <text class="f-note" x="24" y="90">base_url = "..."</text>
  <text class="f-note" x="24" y="110">_send  = &lt;channel&gt;</text>
  <text class="f-note" x="8" y="162">read_closure(_send) →</text>
  <text class="f-note f-warm" x="8" y="182">{}   nothing to steal</text>
  <line x1="380" y1="18" x2="380" y2="232" stroke="#b26a3c" stroke-width="2"/>
  <line x1="386" y1="18" x2="386" y2="232" stroke="#b26a3c" stroke-width="2"/>
  <text class="f-label" x="383" y="248" text-anchor="middle">process boundary</text>
  <g class="f-packet">
    <rect x="196" y="76" width="148" height="26" fill="#100b08" stroke="#e39b4a" stroke-width="1"/>
    <text class="f-note f-warm" x="270" y="93" text-anchor="middle">GET /positions</text>
  </g>
  <rect x="470" y="40" width="282" height="112" fill="none" stroke="#b26a3c" stroke-width="1"/>
  <text class="f-node" x="486" y="66">TrustedBroker</text>
  <text class="f-note f-hot" x="486" y="90">_auth = ('svc_user', 'hunter2')</text>
  <text class="f-note" x="486" y="110">allowed_prefix = "/analytics"</text>
  <text class="f-note f-warm" x="486" y="134">canonicalise → authorise → send</text>
  <line x1="470" y1="182" x2="400" y2="182" stroke="#d93b2b" stroke-width="1" stroke-dasharray="4 4"/>
  <line x1="428" y1="172" x2="412" y2="192" stroke="#d93b2b" stroke-width="1.5"/>
  <line x1="412" y1="172" x2="428" y2="192" stroke="#d93b2b" stroke-width="1.5"/>
  <text class="f-note f-hot" x="478" y="186">the credential never crosses</text>
</svg>
<figcaption>The request crosses. The credential does not. Nothing on the left side is worth attacking, so nothing on the left side needs armouring.</figcaption>
</figure>
</div>

```python
class TrustedBroker:
    """Holds the credential. Checks the path. No untrusted code runs here."""

    def __init__(self, allowed_prefix, username, password):
        self._allowed_prefix = _canonical(allowed_prefix)
        self._auth = (username, password)   # a plain attribute — correct here

    def handle(self, url):
        canonical = _canonical(url)         # collapse '.' and '..' FIRST
        if canonical != self._allowed_prefix and not canonical.startswith(
            self._allowed_prefix + "/"      # compare at a segment boundary
        ):
            raise PermissionError(f"{canonical} is outside {self._allowed_prefix}")
        return requests.get(canonical, auth=self._auth)


class SandboxClient:
    """Lives where untrusted code runs. Holds nothing worth stealing."""

    def __init__(self, base_url, send):
        self.base_url = base_url.rstrip("/")
        self._send = send                   # a channel, not a credential
```

Now run round 3's entire attack suite against the sandbox side:

```text
real __dict__:     ['base_url', '_send']
closure of _send:  {}
```

Empty. Not blocked, not armoured, not faked — **empty**. There is no defence to defeat because there is no secret on that side of the wall.

Note the two details in `handle()` that are easy to get wrong, and that no amount of process isolation would have saved you from:

```text
https://api.example.com/analytics/positions
  -> 200 OK (authenticated as svc_user)
https://api.example.com/admin/billing
  -> PermissionError: outside https://api.example.com/analytics
https://api.example.com/analytics-evil/x
  -> PermissionError: outside https://api.example.com/analytics
https://api.example.com/analytics/../admin/billing
  -> PermissionError: outside https://api.example.com/analytics
```

A bare `startswith()` would have waved `analytics-evil` straight through. Canonicalising *after* the check instead of before would have waved the `..` traversal through. Moving the secret across a boundary buys you the right to make the check somewhere trustworthy; it does not write the check for you.

## So keep the underscores

Here is the part that gets lost when people first meet this material and conclude that encapsulation is pointless.

`_auth` as a plain attribute is **wrong** in a client you hand to untrusted code, and **correct** in `TrustedBroker` — the same spelling, the same language, opposite verdicts. What changed is not how carefully the name was hidden. It is who can run code in that interpreter.

So keep writing the underscores. Keep the `__repr__` that does not print the token. Those things stop credentials leaking into log lines, tracebacks, error reports and LLM transcripts, and that class of accident is *overwhelmingly* how secrets actually escape in practice. It is genuinely valuable work.

Just file it under hygiene. Process, container and network boundaries are the security.

## Run it yourself

The eight lessons are in [brianbruff/python-security-intro](https://github.com/brianbruff/python-security-intro), with no dependencies beyond the standard library. Run them in order — lesson 5 breaks lesson 4, and lesson 7 breaks lesson 6:

```bash
uv run python lessons/lesson_01_attributes_are_public.py
uv run python -m lessons.lesson_05_attack_one_walk_the_closure
uv run python -m lessons.lesson_07_the_bypass
uv run python lessons/lesson_08_where_the_boundary_goes.py
```

The repo ends with four exercises. The one I would push you towards is the fourth: write the pytest suite that asserts `SandboxClient` cannot surrender a credential by *any* reflection route, and that `TrustedBroker` refuses every traversal you can invent. If you are shipping a plugin host or an agent runtime, that suite is not an exercise. It is the test you are missing.
