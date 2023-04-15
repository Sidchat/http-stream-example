import { Logger } from "./utils/logger";

Logger.info(`Hello typescript`);

const prettyPrint = (func: any) => {
    return function (s: any) {
        return func(s, undefined, 2);
    }
}

import * as http from 'node:http';

let pprint = prettyPrint(JSON.stringify);

const makeHttpRequest = (payload: any, host: string, port: number, path: string, method: string) => {
    const postData = JSON.stringify(payload);
    Logger.info(`http request was invoked with ${host}:${port}${path} using ${method}...`);
    let errorCondition = false;
    let streamFinished = false;
    const options: http.RequestOptions = {
    hostname: host, //Change host
    port: port,                        //Change port
    path: path,                       //Change path
    method: method,                   //Change method
    headers: {
        'Content-Type': 'application/xml',
        'Content-Length': Buffer.byteLength(postData),
    },
    };
    
    let chunkCount = 0;
    const req = http.request(options, (res) => {
    Logger.info(`STATUS: ${res.statusCode}`);
    Logger.info(`HEADERS: ${pprint(res.headers)}`);
    //Logger.info(`Response object: ${JSON.stringify(res)}`); //JSON circular structure error
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
        Logger.info(`BODY: ${chunkCount}: ${chunk}`);
        chunkCount++;
    });
    res.on('end', () => {
        Logger.info(`No more data in response.${chunkCount} chunks were read.`);
        streamFinished = true;
    });
    });

    req.on('error', (e) => {
    Logger.error(`problem with request: ${e.message}`);
    errorCondition = true;
    });

    // Write data to request body
    req.write(postData);
    Logger.info(`Request object: ${JSON.stringify(req, undefined, 2)}`);
    req.end();
    //while(!streamFinished)
}

makeHttpRequest({}, 'www.httpforever.com', 80, '/','GET');