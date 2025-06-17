---
title: "Oracle Database Restore"
date: "2011-01-04"
tags: ["oracle"]
---

How to create an oracle user/schema and resore an existing database to this new schema.

drop tablespace xxx_demo_data including contents and datafiles;

CREATE TABLESPACE xxx_demo_data  
DATAFILE 'd:\oradata\abci\xxx_demo.DBF '  
SIZE 10M  
AUTOEXTEND ON NEXT 10M  
MAXSIZE UNLIMITED;

drop user xxx_demo cascade;

CREATE USER xxx_demo  
IDENTIFIED BY xxx_demo  
DEFAULT TABLESPACE xxx_demo_data  
TEMPORARY TABLESPACE temp;

GRANT CREATE SESSION TO xxx_demo;

GRANT CREATE TABLE TO xxx_demo;  
GRANT CREATE VIEW TO xxx_demo;  
GRANT CREATE SEQUENCE TO xxx_demo;  
GRANT CREATE TRIGGER TO xxx_demo;  
GRANT RESOURCE TO xxx_demo;

ALTER USER xxx_demo QUOTA unlimited ON xxx_demo_data;

// change the passworkd.  
//drop to command line

impdp xxx_demo/{passwd} DIRECTORY=expdp_dir DUMPFILE=20101220-DEMO.DMP REMAP_SCHEMA=xxx:xxx_demo REMAP_tablespace=xxx:xxx_demo
