#!/usr/bin/env bash

// // Create an Atlas database admin user:
// mongocli dbuser create atlasAdmin --username <username>  --projectId <projectId>
//
// // Create a database user with read/write access to any database:
// mongocli dbuser create readWriteAnyDatabase --username <username> --projectId <projectId>
//
// // Create a database user with multiple roles:
// mongocli dbuser create --username <username> --role clusterMonitor,backup --projectId <projectId>
//
// // Create a database user with multiple scopes:
// mongocli dbuser create --username <username> --role clusterMonitor --scope clusterName:CLUSTER,DataLakeName:DATA_LAKE --projectId <projectId>

db.createUser(
    {
        user: "mongoadmin",
        pwd: "cmVzdW1lX3BvcnRmb2xpbw",
        roles:
            [
                {
                    role: "readWrite",
                    db: "safehome"
                },
                "clusterAdmin"
            ]
    })