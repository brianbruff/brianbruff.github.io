---
title: "Reading a file in windows 8 CPP vs CSharp"
date: "2012-02-24"
tags: ["C++ vs c#"]
---

I left my last blog very indecisive, would I use CPP, would I use .NET or would it be html/js.

Again I’m thinking Cpp is really for faster and better performance, and while it might even be the hands down winner on ARM architecture, I don’t expect to see any performance differences in the app I’m going to write.

I’m actually going to write the same application 3 times, and I’ll review my findings as I go along.

I’ll present the c++ and the c# apps here and the html/js will follow in the next blog post.

First up was the cpp. To be honest I did find this painful to write, the syntax is pretty convoluted. At least the markup for cpp is Silverlight so that was a no brainer.

    <Grid x:Name="LayoutRoot" Background="#FF0C0C0C">

        <Button Content="Open" HorizontalAlignment="Left"

             Height="4" Margin="84,45,0,0" VerticalAlignment="Top"

             Width="194" Click="Button_Click"/>

        <TextBlock HorizontalAlignment="Left" Height="381"

            Margin="282,45,0,0" Text="TextBox" VerticalAlignment="Top"

            Width="1065" x:Name="tb1"/>

    Grid>

I’ll even use the same markup for the C# application.

Now to the code

## C++

    #include "pch.h"

    #include "MainPage.xaml.h"

    using namespace Windows::UI::Xaml;

    using namespace Windows::UI::Xaml::Controls;

    using namespace Windows::UI::Xaml::Data;

    using namespace Windows::Storage;

    using namespace Windows::Storage::Pickers;

    using namespace Windows::Storage::Streams;

    using namespace Windows::Foundation;

    using namespace CppApplication17;

    MainPage::MainPage()

    {

        InitializeComponent();

    }

    MainPage::~MainPage()

    {

    }

    void CppApplication17::MainPage::Button_Click(Platform::Object^ sender, Windows::UI::Xaml::RoutedEventArgs^ e)

    {

        auto openPicker = ref new FileOpenPicker();

        openPicker->SuggestedStartLocation = PickerLocationId::Desktop;

        openPicker->FileTypeFilter->Append(".log");

        auto pickOp = openPicker->PickSingleFileAsync();

        TextBlock^ content = tb1;

        pickOp->Completed = ref new AsyncOperationCompletedHandler(

        [content](IAsyncOperation^ operation)

        {

            StorageFile^ file = operation->GetResults();

            if (file)

            {

                //content->Text = file->FileName;

                auto openOp = file->OpenForReadAsync();

                openOp->Completed = ref new AsyncOperationCompletedHandler(

                [content, file](IAsyncOperation^ readOperation)

                {

                    auto stream = readOperation->GetResults();

                    auto reader = ref new DataReader(stream);

                    auto loadOp = reader->LoadAsync(file->Size);

                    loadOp->Completed = ref new AsyncOperationCompletedHandlerint>(

                    [content, reader](IAsyncOperationint>^ bytesRead)

                    {

                        auto contentString = reader->ReadString(bytesRead->GetResults());

                        content->Text = contentString;

                    });

                    loadOp->Start();

                });

                openOp->Start();

            }

        });

        pickOp->Start();

    }

## C#

    using System;

    using Windows.Storage.Pickers;

    using Windows.Storage.Streams;

    using Windows.UI.Xaml;

    namespace CSharpApp12

    {

        partial class MainPage

        {

            public MainPage()

            {

                InitializeComponent();

            }

            async private void Button_Click(object sender, RoutedEventArgs e)

            {

                var openPicker = new FileOpenPicker();

                openPicker.SuggestedStartLocation = PickerLocationId.Desktop;

                openPicker.FileTypeFilter.Add(".log");

                var file = await openPicker.PickSingleFileAsync();

                if (file != null)

                {

                    uint size = (uint)file.Size;

                    var inputStream = await file.OpenForReadAsync();

                    var dataReader = new DataReader(inputStream);

                    tb1.Text = dataReader.ReadString(await dataReader.LoadAsync(size));

                }

            }

        }

    }

Now I’m not going to explain every trivial detail, but’s here where I felt I c# won out.

- C++ 11 lambda syntax is a bit clumbsy, I don’t like having to pass down my closure variables or having to make a local copy first
- C++ intellisense is vastly inferior, to the point of being just painful. Lets be honest, tooling cannot be under estimated when it comes to productivity. (this is why I when I write Java I find that only since i started using IntelliJ has my speed really ramped up, it’s the right tool for my background.)
- I’m fast at typing, but using . is a lot faster than –> for pointers.
- The async await construct is just magical!, now, to those you who I’m sure will complain that I’m comparing apples with oranges, you have a bit of a moot point, in C++ I could have used the parallel patterns library to make it a little neater, but nowhere near as close to C#.

My next post I’ll rewrite the same application in html + js. I predict that the syntax is not that difficult but productivity is where I feel I may fall down… let’s see.. It **promise** s to be interesting.
