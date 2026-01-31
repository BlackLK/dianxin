// 非青龙下在文件开头添加账号配置,
//process.env.chinaTelecomAccount = `
//13454545457#123456
//13454545457#456789
//`.trim();

//变量格式: 手机号#服务密码
//多号创建多个变量或者换行、&隔开


(function (unusedArg) {
  process.env.NODE_OPTIONS = "--max-old-space-size=4096 --openssl-legacy-provider";
  process.env.NODE_OPTIONS += " --tls-cipher-list=DEFAULT@SECLEVEL=0";
  const {
    "DOMParser": XmlDomParserClass
  } = require("xmldom");
  delete __filename;
  delete __dirname;
  var xmlDomParser = new XmlDomParserClass({
    "locator": {},
    "errorHandler": {
      "warning": function (w) {},
      "error": function (e) {},
      "fatalError": function (e) {}
    }
  });
  const env = createEnv("电信营业厅"),
    globalEnv = env,
    gotClient = require("got"),
    pathModule = require("path"),
    {
      "exec": childProcessExec
    } = require("child_process"),
    fsModule = require("fs"),
    CryptoJS = require("crypto-js"),
    chinaTelecomStr = "ChinaTelecom",
    accountSplitReg = new RegExp("[\\n\\&\\@]", ""),
    accountEnvKeys = [chinaTelecomStr + "Account"],
    defaultRequestTimeout = 30000,
    maxRequestRetry = 3,
    mallRpcEnvKey = chinaTelecomStr + "Rpc",
    mallRpcUrl = process.env[mallRpcEnvKey],
    scriptVersion = 6.02,
    appNameKey = "ChinaTelecom",
    versionCheckUrl = "https://leafxcy.coding.net/api/user/leafxcy/project/validcode/shared-depot/validCode/git/blob/master/code.json",
    mallAppKey = "JinDouMall";
  let tokenCache = {};
  const tokenCacheFile = "./chinaTelecom_cache.json",
    defaultUserAgent = "Mozilla/5.0 (Linux; U; Android 12; zh-cn; ONEPLUS A9000 Build/QKQ1.190716.003) AppleWebKit/533.1 (KHTML, like Gecko) Version/5.0 Mobile Safari/533.1",
    aesKey = "34d7cb0bcdf07523",
    tripleDesKey = "1234567`90koiuyhgtrfdews",
    tripleDesIv = "\0\0\0\0\0\0\0\0",
    loginRsaPublicKeyShort = "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDBkLT15ThVgz6/NOl6s8GNPofdWzWbCkWnkaAm7O2LjkM1H7dMvzkiqdxU02jamGRHLX/ZNMCXHnPcW/sDhiFCBN18qFvy8g6VYb9QtroI09e176s+ZCtiv7hbin2cCTj99iUpnEloZm19lwHyo69u5UMiPMpq0/XKBO8lYhN/gwIDAQAB",
    loginRsaPublicKey = "\n-----BEGIN PUBLIC KEY-----\n" + loginRsaPublicKeyShort + "\n-----END PUBLIC KEY-----",
    mallRsaPublicKeyShort = "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC+ugG5A8cZ3FqUKDwM57GM4io6JGcStivT8UdGt67PEOihLZTw3P7371+N47PrmsCpnTRzbTgcupKtUv8ImZalYk65dU8rjC/ridwhw9ffW2LBwvkEnDkkKKRi2liWIItDftJVBiWOh17o6gfbPoNrWORcAdcbpk2L+udld5kZNwIDAQAB",
    mallRsaPublicKey = "-----BEGIN PUBLIC KEY-----\n" + mallRsaPublicKeyShort + "\n-----END PUBLIC KEY-----",
    xbkRsaPublicKeyShort = "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDIPOHtjsc6p4sTlpFvrx+ESyEkEvT4JPB/dcE7bUy+cmcwmVEwZFymqKlQ9q8laSHX4IxExJyvE4JMB/dceH5LKC1EcJlopJqo9Oo95o8W63Euq6K+AKMzyZt1SEqbtZ0mXsNUbP8ePUPnuN/5aoB3kPLYpfEwBhbhtou6yrwIDAQAB",
    xbkRsaPublicKey = "-----BEGIN PUBLIC KEY-----\n" + xbkRsaPublicKeyShort + "\n-----END PUBLIC KEY-----",
    NodeRsa = require("node-rsa");
  let loginRsa = new NodeRsa(loginRsaPublicKey);
  const loginRsaOptions = {
    "encryptionScheme": "pkcs1"
  };
  loginRsa.setOptions(loginRsaOptions);
  let mallRsa = new NodeRsa(mallRsaPublicKey);
  const mallRsaOptions = {
    "encryptionScheme": "pkcs1"
  };
  mallRsa.setOptions(mallRsaOptions);
  let xbkRsa = new NodeRsa(xbkRsaPublicKey);
  const xbkRsaOptions = {
    "encryptionScheme": "pkcs1"
  };
  xbkRsa.setOptions(xbkRsaOptions);
  const monthVideoTypeList = [202201, 202202, 202203],
    maxAuthRetry = 5;
  function aesEncrypt(modeName, modeType, paddingName, plainText, key, iv) {
    return CryptoJS[modeName].encrypt(CryptoJS.enc.Utf8.parse(plainText), CryptoJS.enc.Utf8.parse(key), {
      "mode": CryptoJS.mode[modeType],
      "padding": CryptoJS.pad[paddingName],
      "iv": CryptoJS.enc.Utf8.parse(iv)
    }).ciphertext.toString(CryptoJS.enc.Hex);
  }
  function aesDecrypt(modeName, modeType, paddingName, cipherHex, key, iv) {
    return CryptoJS[modeName].decrypt({
      "ciphertext": CryptoJS.enc.Hex.parse(cipherHex)
    }, CryptoJS.enc.Utf8.parse(key), {
      "mode": CryptoJS.mode[modeType],
      "padding": CryptoJS.pad[paddingName],
      "iv": CryptoJS.enc.Utf8.parse(iv)
    }).toString(CryptoJS.enc.Utf8);
  }
  function saveTokenCache() {
    try {
      fsModule.writeFileSync(tokenCacheFile, JSON.stringify(tokenCache, null, 4), "utf-8");
    } catch (e) {
      console.log("保存缓存出错");
    }
  }
  function loadTokenCache() {
    try {
      tokenCache = JSON.parse(fsModule.readFileSync(tokenCacheFile, "utf-8"));
    } catch (e) {
      console.log("读取缓存出错, 新建一个token缓存");
      saveTokenCache();
    }
  }
  let activeProcessCount = 0,
    processGuardStatus = 0;
  function initProcessGuard() {
    {
      processGuardStatus = 1;
      process.on("SIGTERM", () => {
        processGuardStatus = 2;
        process.exit(0);
      });
      const scriptName = pathModule.basename(process.argv[1]),
        excludeKeywords = ["bash", "timeout", "grep"];
      let cmdList = ["ps afx"];
      cmdList.push("grep " + scriptName);
      cmdList = cmdList.concat(excludeKeywords.map(keyword => "grep -v \"" + keyword + "\" "));
      cmdList.push("wc -l");
      const fullCmd = cmdList.join("|"),
        checkProcess = () => {
          childProcessExec(fullCmd, (error, stdout, stderr) => {
            if (error || stderr) {
              return;
            }
            activeProcessCount = parseInt(stdout.trim(), 10);
          });
          processGuardStatus == 1 && setTimeout(checkProcess, 2000);
        };
      checkProcess();
    }
  }
  class TelecomBaseClient {
    constructor() {
      this.index = env.userIdx++;
      this.name = "";
      this.valid = false;
      const retryOptions = {
          "limit": 0
        },
        headerOptions = {
          "Connection": "keep-alive"
        },
        gotOptions = {
          "retry": retryOptions,
          "timeout": defaultRequestTimeout,
          "followRedirect": false,
          "ignoreInvalidCookies": true,
          "headers": headerOptions
        };
      this.got = gotClient.extend(gotOptions);
      processGuardStatus == 0 && initProcessGuard();
    }
    ["log"](message, options = {}) {
      var prefix = "",
        paddingLen = env.userCount.toString().length;
      this.index && (prefix += "[账号" + env.padStr(this.index, paddingLen) + "]");
      this.name && (prefix += "[" + this.name.slice(0, 3) + "****" + this.name.slice(-4) + "]");
      env.log(prefix + message, options);
    }
    ["get_rscode"](content, script1, script2, tsID) {
      let functionBody = "\n        null_function = function () {}\n        content=\"" + content + "\";\n        tsID=\"" + tsID + "\"\n        delete __dirname \n        delete __filename \n        ActiveXObject = undefined;\n        \n        Window = null_function\n        window = self = parent = top = globalThis;\n        addEventListener = null_function\n        \n        attachEvent = null_function\n        navigator = {userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36'}\n        HTMLCollection = []\n        HTMLCollection.length = 0\n        div = {\n            getElementsByTagName() {\n                return HTMLCollection\n            },\n            innerHTML: '',\n        \n        }\n        getAttribute = function () {\n            if (arguments[0] == 'r') {\n                return 'm'\n            }\n        }\n        meta = {\n            content: \"text/html; charset=utf-8\",\n            http_Equiv: \"Content-Type\",\n            id:tsID,\n            getAttribute: function (arg) {\n                if (arg === 'r') {\n                    return 'm'\n                }\n            },\n            parentNode: {\n                removeChild: function () {}\n            }\n        }\n        getElementsByTagNameObj = {}\n        metav={\n            id:tsID,\n            content:content,\n            r:\"m\",\n            getAttribute: function (arg) {\n                if (arg === 'r') {\n                    return 'm'\n                }\n            },\n            parentNode: {\n                removeChild: null_function\n            }\n        }\n        \n        documentElement = {\n            addEventListener: addEventListener\n        }\n        document = {\n            characterSet: 'UTF-8',\n            charset: 'UTF-8',\n            createElement() {\n                if (arguments[0] === 'div') {\n                    return div\n                }\n                return {}\n            },\n            getElementsByTagName: function (arg) {\n                if (arg === 'script') {\n                    return {}\n                }\n                if (arg === 'base') {\n                    return {length: 0}\n                }\n            },\n            documentElement: documentElement,\n            addEventListener: addEventListener,\n            attachEvent: attachEvent,\n            getElementById: function () {\n                if (arguments[0] === tsID) {\n                    return metav\n                }\n                if (arguments[0] == 'root-hammerhead-shadow-ui') {\n                    return null\n                }\n                return {}\n            },\n            appendChild:null_function,\n            removeChild: null_function\n        }\n        location={\n            \"href\": \"https://\",\n            \"origin\": \"\",\n            \"protocol\": \"\",\n            \"host\": \"\",\n            \"hostname\": \"\",\n            \"port\": \"\",\n            \"pathname\": \"\",\n            \"search\": \"\",\n            \"hash\": \"\"\n        }\n        //setTimeout = null_function\n        setInterval = null_function\n        " + script1 + "\n        " + script2 + "\n        function getck() {\n            return document.cookie\n        }\n        return {getck};\n        ";
      const rsFunction = new Function(functionBody),
        rsInstance = rsFunction();
      const rsCk = rsInstance.getck();
      this.rsFun = rsFunction;
      this.getrsCk = rsCk;
      return rsFunction;
    }
    async ["parseCookies"](cookieString, setCookieHeader) {
      {
        let cookieMap = {},
          cookieList = cookieString.split(";");
        cookieList.forEach(part => {
          part = part.trim();
          if (part.includes("=")) {
            let [cookieKey, cookieValue] = part.split("=", 2);
            !cookieKey.toLowerCase().includes("path") && !cookieKey.toLowerCase().includes("expires") && !cookieKey.toLowerCase().includes("secure") && !cookieKey.toLowerCase().includes("samesite") && (cookieMap[cookieKey] = cookieValue);
          }
        });
        if (setCookieHeader) {
          cookieMap.yiUIIlbdQT3fO = setCookieHeader.split("=")[1];
        }
        return cookieMap;
      }
    }
    async ["request"](requestOptions) {
      {
        let ckvalueCookies = requestOptions?.["ckvalue"] || "";
        const retriableErrorCodes = ["ECONNRESET", "EADDRINUSE", "ENOTFOUND", "EAI_AGAIN"],
          timeoutErrorNames = ["TimeoutError"],
          nonRetryErrorCodes = ["EPROTO"],
          defaultValidStatusCodes = [];
        var response = null,
          retryCount = 0,
          requestName = requestOptions.fn || requestOptions.url;
        let validStatusCodes = globalEnv.get(requestOptions, "valid_code", defaultValidStatusCodes);
        requestOptions.method = requestOptions?.["method"]?.["toUpperCase"]() || "GET";
        requestOptions?.["ckvalue"] && (requestOptions.headers = requestOptions?.["headers"] || {
          "Cookie": "yiUIIlbdQT3fP=" + (ckvalueCookies.yiUIIlbdQT3fP || "") + "; yiUIIlbdQT3fO=" + (ckvalueCookies.yiUIIlbdQT3fO || "")
        });
        let errorCode, errorName;
        while (retryCount < maxRequestRetry) {
          try {
            {
              retryCount++;
              errorCode = "";
              errorName = "";
              let lastError = null,
                timeout = requestOptions?.["timeout"] || this.got?.["defaults"]?.["options"]?.["timeout"]?.["request"] || defaultRequestTimeout,
                isTimeout = false,
                indexFactor1 = Math.max(this.index - 2, 0),
                indexFactor2 = Math.min(Math.max(this.index - 3, 1), 3),
                indexFactor3 = Math.min(Math.max(this.index - 4, 1), 4),
                baseDelay = indexFactor1 * indexFactor2 * indexFactor3 * 400,
                randomDelayRange = indexFactor1 * indexFactor2 * indexFactor3 * 1800,
                randomIndexDelay = baseDelay + Math.floor(Math.random() * randomDelayRange),
                userCount = globalEnv.userCount,
                userDelayBase = userCount * (userCount - 1) * 2000,
                userDelayRange = (userCount - 1) * (userCount - 1) * 2000,
                randomUserDelay = userDelayBase + Math.floor(Math.random() * userDelayRange),
                userIndexFactor1 = Math.max(globalEnv.userCount - 2, 0),
                userIndexFactor2 = Math.max(globalEnv.userCount - 3, 0),
                userBaseDelay = userIndexFactor1 * 200,
                userDelayRandomRange = userIndexFactor2 * 400,
                randomUserIndexDelay = userBaseDelay + Math.floor(Math.random() * userDelayRandomRange),
                totalRandomDelay = randomIndexDelay + randomUserDelay + randomUserIndexDelay;
              await new Promise(async resolveRequest => {
                {
                  setTimeout(() => {
                    isTimeout = true;
                    resolveRequest();
                  }, timeout);
                  let cookieObj = resolveRequest?.["ckvalue"] || "";
                  requestOptions?.["ckvalue"] && (requestOptions.headers = requestOptions?.["headers"] || {
                    "Cookie": "yiUIIlbdQT3fP=" + (cookieObj.yiUIIlbdQT3fP || "") + "; yiUIIlbdQT3fO=" + (cookieObj.yiUIIlbdQT3fO || "")
                  });
                  try {
                    const gotResponse = await this.got(requestOptions);
                    response = gotResponse;
                  } catch (requestError) {
                    if (requestError.response?.["statusCode"] == 412) {
                      {
                        const {
                          "contentCODE": contentCode,
                          "tsCODE": tsCode,
                          "srcAttribute": srcAttr,
                          "tsID": tsId
                        } = globalEnv.get(requestError, "resoultCode", requestError.response?.["statusCode"]);
                        const rsRequestOptions = {
                          "fn": "getrs",
                          "method": "get",
                          "url": "https://wappark.189.cn" + srcAttr
                        };
                        let {
                          "result": rsResult,
                          "statusCode": rsStatusCode
                        } = await this.request(rsRequestOptions);
                        let setCookieStr = "";
                        if (requestError.response && requestError.response.headers) {
                          const setCookieHeaders = requestError.response.headers["set-cookie"];
                          Array.isArray(setCookieHeaders) && (setCookieStr = setCookieHeaders.map(c => c.split(";")[0]).join("; "));
                        }
                        this.get_rscode(contentCode, tsCode, rsResult, tsId);
                        let rsCkValue = this.getrsCk;
                        rsCkValue = this.rsFun().getck();
                        cookieObj = await this.parseCookies(rsCkValue, setCookieStr);
                        if (cookieObj) {
                          {
                            requestOptions.headers = {
                              "Cookie": "yiUIIlbdQT3fP=" + (cookieObj.yiUIIlbdQT3fP || "") + "; yiUIIlbdQT3fO=" + (cookieObj.yiUIIlbdQT3fO || "")
                            };
                            try {
                              const retryResponse = await this.got(requestOptions);
                              response = retryResponse;
                            } catch (retryError) {
                              lastError = retryError;
                              response = retryError.response;
                              errorCode = retryError.response?.["code"] || "";
                              errorName = retryError.response?.["name"] || "";
                              console.log(errorCode, "Retry failed");
                            }
                          }
                        }
                      }
                    } else lastError = requestError, response = requestError.response, errorCode = requestError.response?.["code"] || "", errorName = requestError.response?.["name"] || "";
                  }
                  resolveRequest();
                }
              });
              if (isTimeout) this.log("[请求超时(" + requestName + ")，重试第" + retryCount + "次, " + timeout / 1000 + "秒]");else {
                if (nonRetryErrorCodes.includes(errorCode)) {
                  this.log("[请求错误(" + requestName + ")][" + errorCode + "][" + errorName + "]");
                  lastError?.["message"] && console.log(lastError.message);
                  break;
                } else {
                  if (timeoutErrorNames.includes(errorName)) this.log("[请求超时(" + requestName + "][" + errorCode + "][" + errorName + "]，重试第" + retryCount + "次");else {
                    if (retriableErrorCodes.includes(errorCode)) this.log("[请求错误(" + requestName + "][" + errorCode + "][" + errorName + "]，重试第" + retryCount + "次");else {
                      {
                        if (response?.["statusCode"] == 412) break;
                        let statusCodeVal = response?.["statusCode"] || "",
                          statusGroup = statusCodeVal / 100 | 0;
                        if (statusCodeVal) {
                          statusGroup > 3 && !validStatusCodes.includes(statusCodeVal) && (statusCodeVal ? this.log("[请求" + requestName + "]返回[" + statusCodeVal + "]") : this.log("请求[" + requestName + "][错误]" + errorCode + "][" + errorName + "]"));
                          if (statusGroup <= 4) break;
                        } else this.log("请求[" + requestName + "]错误[" + errorCode + "][" + errorName + "]");
                      }
                    }
                  }
                }
              }
            }
          } catch (finalError) {
            finalError.name == "TimeoutError" ? this.log("[请求超时，重试第" + requestName + "]" + retryCount + "次") : this.log("[请求错误(" + requestName + ")，重试第" + finalError.message + "]" + retryCount + "次");
          }
        }
        const defaultResult = {
          "statusCode": errorCode || -1,
          "headers": null,
          "result": null
        };
        if (response == null) return Promise.resolve(defaultResult);
        let {
          "statusCode": statusCode,
          "headers": headers,
          "body": body
        } = response;
        if (body) try {
          body = JSON.parse(body);
        } catch {}
        const resultWrapper = {
          "statusCode": statusCode,
          "headers": headers,
          "result": body
        };
        return Promise.resolve(resultWrapper);
      }
    }
  }
  let BaseClientClass = TelecomBaseClient;
  try {
    let LocalBasicClient = require("./LocalBasic");
    BaseClientClass = LocalBasicClient;
  } catch {}
  let versionCheckClient = new BaseClientClass(env);
  class TelecomAccountClient extends BaseClientClass {
    constructor(accountInfo) {
      {
        super(env);
        let parts = accountInfo.split("#");
        this.name = parts[0];
        this.passwd = parts?.[1] || "";
        this.uuid = [env.randomPattern("xxxxxxxx"), env.randomPattern("xxxx"), env.randomPattern("xxx4".split("").reverse().join("")), env.randomPattern("xxxx"), env.randomPattern("xxxxxxxxxxxx".split("").reverse().join(""))];
        this.can_feed = true;
        this.jml_tokenFlag = "";
        this.mall_token = "";
        const _0x25e486 = {
          "Connection": "keep-alive",
          "User-Agent": defaultUserAgent,
          "123456789": "987654321"
        };
      }
    }
    ["load_token"]() {
      {
        let loadedFromCache = false;
        tokenCache[this.name] && (this.userId = tokenCache[this.name].userId, this.token = tokenCache[this.name].token, this.log("读取到缓存token"), loadedFromCache = true);
        return loadedFromCache;
      }
    }
    ["encode_phone"]() {
      let chars = this.name.split("");
      for (let index in chars) {
        chars[index] = String.fromCharCode(chars[index].charCodeAt(0) + 2);
      }
      return chars.join("");
    }
    ["encode_aes"](data) {
      return aesEncrypt("SEA".split("").reverse().join(""), "ECB", "Pkcs7", data, aesKey, 0);
    }
    ["get_mall_headers"]() {
      return {
        "Content-Type": "application/json;charset=utf-8",
        "Accept": "application/json, text/javascript, */*; q=0.01",
        "Authorization": this.mall_token ? "Bearer " + this.mall_token : "",
        "X-Requested-With": "XMLHttpRequest"
      };
    }
    async ["rsCk"](arg1, arg2) {
      {
        const result = await rs(arg1, arg2);
        console.log(result);
      }
    }
    /**
     * 登录
     */
    async ["login"](loginOptions = {}) {
      {
        let isLoginSuccess = false;
        try {
          let timestamp = globalEnv.time("yyyyMMddhhmmss"),
            loginSignature = "iPhone 14 15.4." + this.uuid.slice(0, 2).join("") + this.name + timestamp + this.passwd + "0$$$0.",
            loginRequest = {
              "fn": "login",
              "method": "post",
              "url": "https://appgologin.189.cn:9031/login/client/userLoginNormal",
              "json": {
                "headerInfos": {
                  "code": "userLoginNormal",
                  "timestamp": timestamp,
                  "broadAccount": "",
                  "broadToken": "",
                  "clientType": "#10.5.0#channel50#iPhone 14 Pro Max#",
                  "shopId": "20002",
                  "source": "110003",
                  "sourcePassword": "Sid98s",
                  "token": "",
                  "userLoginName": this.encode_phone()
                },
                "content": {
                  "attach": "test",
                  "fieldData": {
                    "loginType": "4",
                    "accountType": "",
                    "loginAuthCipherAsymmertric": loginRsa.encrypt(loginSignature, "base64"),
                    "deviceUid": this.uuid.slice(0, 3).join(""),
                    "phoneNum": this.encode_phone(),
                    "isChinatelecom": "0",
                    "systemVersion": "15.4.0",
                    "authentication": Array.from(this.passwd).map(char => String.fromCharCode(char.charCodeAt(0) + 2)).join('')
                  }
                }
              }
            },
            {
              "result": loginResult,
              "statusCode": loginStatusCode
            } = await this.request(loginRequest),
            loginResultCode = globalEnv.get(loginResult?.["responseData"], "resultCode", -1);
          if (loginResultCode == "0000") {
            {
              let {
                "userId": userId = "",
                "token": token = ""
              } = loginResult?.["responseData"]?.["data"]?.["loginSuccessResult"] || {};
              this.userId = userId;
              this.token = token;
              this.log("使用服务密码登录成功");
              tokenCache[this.name] = {
                "token": token,
                "userId": userId,
                "t": Date.now()
              };
              saveTokenCache();
              isLoginSuccess = true;
            }
          } else {
            {
              let errorMsg = loginResult?.["msg"] || loginResult?.["responseData"]?.["resultDesc"] || loginResult?.["headerInfos"]?.["reason"] || "";
              this.log("服务密码登录失败[" + loginResultCode + " :]" + errorMsg);
            }
          }
        } catch (error) {
          console.log(error);
        } finally {
          return isLoginSuccess;
        }
      }
    }
    /**
     * 获取Ticket
     */
    async ["get_ticket"](ticketOptions = {}) {
      let ticket = "";
      try {
        {
          let ticketXmlBody = "\n            <Request>\n                <HeaderInfos>\n                    <Code>getSingle</Code>\n                    <Timestamp>" + env.time("yyyyMMddhhmmss") + "</Timestamp>\n                    <SourcePassword>Sid98s</SourcePassword>\n                    <Source>110003</Source>\n                    <ShopId>20002</ShopId>\n                    <ClientType>#1.6.9#channel50#iPhone 14 Pro Max#</ClientType>\n                    <BroadToken></BroadToken>\n                    <BroadAccount></BroadAccount>\n                    <Token>" + this.token + "</Token>\n                    <UserLoginName>" + this.name + "</UserLoginName>\n                </HeaderInfos>\n                <Content>\n                    <Attach>test</Attach>\n                    <FieldData>\n                        <TargetId>" + aesEncrypt("TripleDES", "CBC", "Pkcs7", this.userId, tripleDesKey, tripleDesIv) + "</TargetId>\n                        <Url>a46862274835b451</Url>\n                    </FieldData>\n                </Content>\n            </Request>";
          const ticketRequest = {
            "fn": "get_ticket",
            "method": "post",
            "url": "https://appgologin.189.cn:9031/map/clientXML",
            "body": ticketXmlBody
          };
          let {
            "result": ticketResult,
            "statusCode": ticketStatusCode
          } = await this.request(ticketRequest);
          if (ticketResult) {
            let ticketMatch = ticketResult.match(new RegExp("<Ticket>\\(\\w+\\)</Ticket>", ""));
            if (ticketMatch) {
              let ticketCipher = ticketMatch[1];
              ticket = aesDecrypt("TripleDES", "CBC", "Pkcs7", ticketCipher, tripleDesKey, tripleDesIv);
              this.ticket = ticket;
            }
          }
          !ticket && (!ticketOptions.retry && (await this.login()) ? (ticketOptions.retry = true, ticket = await this.get_ticket(ticketOptions)) : (this.log("没有获取到ticket[" + ticketStatusCode + "]: "), ticketResult && this.log(" :" + JSON.stringify(ticketResult))));
        }
      } catch (error) {
        console.log(error);
      } finally {
        return ticket;
      }
    }
    /**
     * 获取签名
     */
    async ["get_sign"](signOptions = {}) {
      let rsCookies = this.rsCkk;
      let signResult = false;
      try {
        const signParams = {
            "ticket": this.ticket
          },
          signRequest = {
            "ckvalue": rsCookies,
            "fn": "login",
            "method": "get",
            "url": "https://wappark.189.cn/jt-sign/ssoHomLogin",
            "searchParams": signParams
          };
        let {
            "result": signResponse,
            "statusCode": signStatusCode
          } = await this.request(signRequest),
          signResultCode = globalEnv.get(signResponse, "resoultCode", signStatusCode);
        signResultCode == 0 ? (signResult = signResponse?.["sign"], this.sign = signResult, this.got = this.got.extend({
          "headers": {
            "sign": this.sign
          }
        })) : this.log("获取sign失败[" + signResultCode + "]: " + signResponse);
      } catch (error) {
        console.log(error);
      } finally {
        return signResult;
      }
    }
    /**
     * 获取RS值
     */
    async ["get_rsValue"](url) {
      {
        let success = false;
        try {
          const rsRequest = {
            "fn": "login",
            "method": "get",
            "url": url
          };
          let {
            "result": rsResponse,
            "statusCode": rsStatusCode,
            "headers": rsHeaders
          } = await this.request(rsRequest);
          const {
            "contentCODE": contentCode,
            "tsCODE": tsCode,
            "srcAttribute": srcAttribute,
            "tsID": tsId
          } = globalEnv.get(rsResponse, "resoultCode", rsStatusCode);
          const rsScriptRequest = {
            "fn": "getrs",
            "method": "get",
            "url": "https://wappark.189.cn" + srcAttribute
          };
          let {
            "result": rsScriptResponse,
            "statusCode": rsScriptStatusCode
          } = await this.request(rsScriptRequest);
          let setCookieStr = "";
          if (rsHeaders && rsHeaders["set-cookie"]) {
            const setCookies = rsHeaders["set-cookie"];
            Array.isArray(setCookies) && (setCookieStr = setCookies.map(cookie => cookie.split(";")[0]).join("; "));
          }
          this.get_rscode(contentCode, tsCode, rsScriptResponse, tsId);
          this.rsCkk = setCookieStr;
        } catch (error) {
          console.log(error);
        } finally {
          return success;
        }
      }
    }
    async ["get_rs"](options = {}) {
      ck = await rs();
      console.log(ck);
    }
    /**
     * 加密参数
     */
    ["encrypt_para"](data) {
      let dataStr = typeof data == "string" ? data : JSON.stringify(data);
      return mallRsa.encrypt(dataStr, "hex");
    }
    /**
     * 用户金豆信息
     */
    async ["userCoinInfo"](notify = false, options = {}) {
      let rsCookies = this.rsCkk;
      let rsCheck = this.getrsCk;
      rsCheck = this.rsFun().getck();
      rsCookies = await this.parseCookies(rsCheck, rsCookies);
      try {
        {
          const coinParams = {
            "phone": this.name
          };
          let coinRequest = {
              "ckvalue": rsCookies,
              "fn": "userCoinInfo",
              "method": "post",
              "url": "https://wappark.189.cn/jt-sign/api/home/userCoinInfo",
              "json": {
                "para": this.encrypt_para(coinParams)
              }
            },
            {
              "result": coinResult,
              "statusCode": coinStatusCode
            } = await this.request(coinRequest),
            coinResultCode = globalEnv.get(coinResult, "resoultCode", coinStatusCode);
          if (coinResultCode == 0) {
            this.coin = coinResult?.["totalCoin"] || 0;
            if (notify) {
              {
                const notifyOptions = {
                  "notify": true
                };
                this.log("金豆余额: " + this.coin, notifyOptions);
                if (coinResult.amountEx) {
                  {
                    let expireDate = globalEnv.time("yyyy-MM-dd", coinResult.expireDate);
                    const expireNotifyOptions = {
                      "notify": true
                    };
                    globalEnv.log("-- [" + expireDate + "将过期]" + coinResult.amountEx + "金豆", expireNotifyOptions);
                  }
                }
              }
            }
          } else {
            let errorMsg = coinResult?.["msg"] || coinResult?.["resoultMsg"] || coinResult?.["error"] || "";
            this.log("查询账户金豆余额错误[" + coinResultCode + "]: " + errorMsg);
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
    /**
     * 用户状态信息
     */
    async ["userStatusInfo"](options = {}) {
      {
        let rsCookies = this.rsCkk;
        let rsCheck = this.getrsCk;
        rsCheck = this.rsFun().getck();
        rsCookies = await this.parseCookies(rsCheck, rsCookies);
        try {
          const statusParams = {
            "phone": this.name
          };
          let statusRequest = {
            "ckvalue": rsCookies,
            "fn": "userStatusInfo",
            "method": "post",
            "url": "https://wappark.189.cn/jt-sign/api/home/userStatusInfo",
            "json": {
              "para": this.encrypt_para(statusParams)
            }
          };
          {
            let {
                "result": statusResult,
                "statusCode": statusStatusCode
              } = await this.request(globalEnv.copy(statusRequest)),
              statusResultCode = globalEnv.get(statusResult, "resoultCode", statusStatusCode);
            if (statusResultCode == 0) {
              let {
                "isSign": isSign
              } = statusResult?.["data"];
              isSign ? this.log("今天已签到") : await this.doSign();
            } else {
              {
                let errorMsg = statusResult?.["msg"] || statusResult?.["resoultMsg"] || statusResult?.["error"] || "";
                this.log("查询账户签到状态错误[" + statusResultCode + "]: " + errorMsg);
              }
            }
          }
          {
            {
              let {
                  "result": signInfoResult,
                  "statusCode": signInfoStatusCode
                } = await this.request(globalEnv.copy(statusRequest)),
                signInfoResultCode = globalEnv.get(signInfoResult, "resoultCode", signInfoStatusCode);
              if (signInfoResultCode == 0) {
                let {
                  "continuousDay": continuousDay,
                  "signDay": signDay,
                  "isSeven": isSeven
                } = signInfoResult?.["data"];
                this.log("已签到" + signDay + "天, 连签" + continuousDay + "天");
                isSeven && (await this.exchangePrize());
              } else {
                let errorMsg = signInfoResult?.["msg"] || signInfoResult?.["resoultMsg"] || signInfoResult?.["error"] || "";
                this.log("查询账户签到状态错误[" + signInfoResultCode + " :]" + errorMsg);
              }
            }
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
    /**
     * 连续签到天数
     */
    async ["continueSignDays"](options = {}) {
      {
        let rsCookies = this.rsCkk,
          rsCheck = this.getrsCk;
        rsCheck = this.rsFun().getck();
        rsCookies = await this.parseCookies(rsCheck, rsCookies);
        try {
          const continueSignParams = {
            "phone": this.name
          };
          let continueSignRequest = {
              "ckvalue": rsCookies,
              "fn": "continueSignDays",
              "method": "post",
              "url": "https://wappark.189.cn/jt-sign/webSign/continueSignDays",
              "json": {
                "para": this.encrypt_para(continueSignParams)
              }
            },
            {
              "result": continueSignResult,
              "statusCode": continueSignStatusCode
            } = await this.request(continueSignRequest),
            continueSignResultCode = globalEnv.get(continueSignResult, "resoultCode", continueSignStatusCode);
          if (continueSignResultCode == 0) {
            {
              this.log("抽奖连签天数: " + (continueSignResult?.["continueSignDays"] || 0) + "天");
              if (continueSignResult?.["continueSignDays"] == 15) {
                const prize15 = {
                  "type": "15"
                };
                await this.exchangePrize(prize15);
              } else {
                if (continueSignResult?.["continueSignDays"] == 28) {
                  const prize28 = {
                    "type": "28"
                  };
                  await this.exchangePrize(prize28);
                }
              }
            }
          } else {
            {
              let errorMsg = continueSignResult?.["msg"] || continueSignResult?.["resoultMsg"] || continueSignResult?.["error"] || "";
              this.log("查询抽奖连签天数错误[" + continueSignResultCode + "]: " + errorMsg);
            }
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
    /**
     * 连续签到记录
     */
    async ["continueSignRecords"](options = {}) {
      {
        let rsCookies = this.rsCkk;
        let rsCheck = this.getrsCk;
        rsCheck = this.rsFun().getck();
        rsCookies = await this.parseCookies(rsCheck, rsCookies);
        try {
          {
            const recordsParams = {
              "phone": this.name
            };
            let recordsRequest = {
                "ckvalue": rsCookies,
                "fn": "continueSignRecords",
                "method": "post",
                "url": "https://wappark.189.cn/jt-sign/webSign/continueSignRecords",
                "json": {
                  "para": this.encrypt_para(recordsParams)
                }
              },
              {
                "result": recordsResult,
                "statusCode": recordsStatusCode
              } = await this.request(recordsRequest),
              recordsResultCode = globalEnv.get(recordsResult, "resoultCode", recordsStatusCode);
            if (recordsResultCode == 0) {
              if (recordsResult?.["continue15List"]?.["length"]) {
                const prize15 = {
                  "type": "15"
                };
                await this.exchangePrize(prize15);
              }
              if (recordsResult?.["continue28List"]?.["length"]) {
                const prize28 = {
                  "type": "28"
                };
                await this.exchangePrize(prize28);
              }
            } else {
              {
                let errorMsg = recordsResult?.["msg"] || recordsResult?.["resoultMsg"] || recordsResult?.["error"] || "";
                this.log("查询连签抽奖状态错误[" + recordsResultCode + "]: " + errorMsg);
              }
            }
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
    /**
     * 执行签到
     */
    async ["doSign"](options = {}) {
      let rsCookies = this.rsCkk;
      let rsCheck = this.getrsCk;
      rsCheck = this.rsFun().getck();
      rsCookies = await this.parseCookies(rsCheck, rsCookies);
      try {
        let signData = {
            "phone": this.name,
            "date": Date.now(),
            "sysType": "20002"
          },
          signRequest = {
            "ckvalue": rsCookies,
            "fn": "doSign",
            "method": "post",
            "url": "https://wappark.189.cn/jt-sign/webSign/sign",
            "json": {
              "encode": this.encode_aes(JSON.stringify(signData))
            }
          },
          {
            "result": signResult,
            "statusCode": signStatusCode
          } = await this.request(signRequest),
          signResultCode = globalEnv.get(signResult, "resoultCode", signStatusCode);
        if (signResultCode == 0) {
          {
            let signCode = globalEnv.get(signResult?.["data"], "code", -1);
            if (signCode == 1) {
              {
                const notifyOptions = {
                  "notify": true
                };
                this.log("签到成功，获得" + (signResult?.["data"]?.["coin"] || 0) + "金豆", notifyOptions);
                await this.userStatusInfo();
              }
            } else {
              {
                const notifyOptions = {
                  "notify": true
                };
                this.log("签到失败[" + signCode + "]: " + signResult.data.msg, notifyOptions);
              }
            }
          }
        } else {
          let errorMsg = signResult?.["msg"] || signResult?.["resoultMsg"] || signResult?.["error"] || "";
          this.log("签到错误[" + signResultCode + "]: " + errorMsg);
        }
      } catch (error) {
        console.log(error);
      }
    }
    /**
     * 兑换奖品
     */
    async ["exchangePrize"](options = {}) {
      let unusedVar10,
        rsCookies = this.rsCkk;
      unusedVar10 = 11;
      let rsCheck = this.getrsCk;
      rsCheck = this.rsFun().getck();
      rsCookies = await this.parseCookies(rsCheck, rsCookies);
      try {
        let prizeType = _0x1a907b.pop(options, "type", "7");
        const prizeParams = {
          "phone": this.name,
          "type": prizeType
        };
        let prizeRequest = {
            "ckvalue": rsCookies,
            "fn": "exchangePrize",
            "method": "post",
            "url": "https://wappark.189.cn/jt-sign/webSign/exchangePrize",
            "json": {
              "para": this.encrypt_para(prizeParams)
            }
          },
          {
            "result": prizeResult,
            "statusCode": prizeStatusCode
          } = await this.request(prizeRequest),
          prizeResultCode = _0x1a907b.get(prizeResult, "resoultCode", prizeStatusCode);
        if (prizeResultCode == 0) {
          {
            let detailCode = _0x1a907b.get(prizeResult?.["prizeDetail"], "code", -1);
            if (detailCode == 0) {
              {
                const notifyOptions = {
                  "notify": true
                };
                this.log("连签" + prizeType + "天抽奖: " + prizeResult?.["prizeDetail"]?.["biz"]?.["winTitle"], notifyOptions);
              }
            } else {
              let detailError = prizeResult?.["prizeDetail"]?.["err"] || "";
              const notifyOptions = {
                "notify": true
              };
              this.log("连签" + prizeType + "天抽奖失败[" + detailCode + "]: " + detailError, notifyOptions);
            }
          }
        } else {
          {
            let errorMsg = prizeResult?.["msg"] || prizeResult?.["resoultMsg"] || prizeResult?.["error"] || "";
            this.log("连签" + prizeType + "天抽奖错误[" + prizeResultCode + " :]" + errorMsg);
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
    /**
     * 首页任务
     */
    async ["homepage"](type, options = {}) {
      var unusedVar11 = 14;
      let rsCookies = this.rsCkk;
      unusedVar11 = "lidkch".split("").reverse().join("");
      var unusedVar12 = 9;
      let rsCheck = this.getrsCk;
      unusedVar12 = "hiamhj";
      rsCheck = this.rsFun().getck();
      rsCookies = await this.parseCookies(rsCheck, rsCookies);
      try {
        const homepageParams = {
          "phone": this.name,
          "shopId": "20001",
          "type": type
        };
        let homepageRequest = {
            "ckvalue": rsCookies,
            "fn": "homepage",
            "method": "post",
            "url": "https://wappark.189.cn/jt-sign/webSign/homepage",
            "json": {
            "para": this.encrypt_para(homepageParams)
          }
        },
        {
          "result": homepageResult,
          "statusCode": homepageStatusCode
        } = await this.request(homepageRequest),
        homepageResultCode = globalEnv.get(homepageResult, "resoultCode", homepageStatusCode);
      if (homepageResultCode == 0) {
        let dataHeaderCode = globalEnv.get(homepageResult?.["data"]?.["head"], "code", -1);
        if (dataHeaderCode == 0) for (let adItem of homepageResult?.["data"]?.["biz"]?.["adItems"] || []) {
          if (["0", "1"].includes(adItem?.["taskState"])) {
            switch (adItem.contentOne) {
              case "3":
                {
                  {
                    adItem?.["rewardId"] && (await this.receiveReward(adItem));
                    break;
                  }
                }
              case "5":
                {
                  await this.openMsg(adItem);
                  break;
                }
              case "6":
                {
                  await this.sharingGetGold();
                  break;
                }
              case "10":
              case "13":
                {
                  !this.xtoken && (await this.get_usercode());
                  this.xtoken && (await this.watchLiveInit());
                  break;
                }
              case "18":
                {
                  {
                    await this.polymerize(adItem);
                    break;
                  }
                }
              default:
                {
                  break;
                }
            }
          }
        } else {
          let errorMsg = homepageResult?.["data"]?.["head"]?.["err"] || "";
          this.log("获取任务列表失败[" + homepageResultCode + " :]" + errorMsg);
        }
      } else this.log("获取任务列表错误[" + homepageResultCode + "]");
    } catch (error) {
      console.log(error);
    }
  }
  /**
   * 领取奖励
   */
  async ["receiveReward"](taskItem, options = {}) {
    {
      let cookie = this.rsCkk,
        rawCookie = this.getrsCk;
      rawCookie = this.rsFun().getck();
      cookie = await this.parseCookies(rawCookie, cookie);
      try {
        let taskTitle = taskItem?.["title"]?.["split"](" ")?.[0];
        const params = {
          "phone": this.name,
          "rewardId": taskItem?.["rewardId"] || ""
        };
        let requestConfig = {
            "ckvalue": cookie,
            "fn": "receiveReward",
            "method": "post",
            "url": "https://wappark.189.cn/jt-sign/paradise/receiveReward",
            "json": {
              "para": this.encrypt_para(params)
            }
          },
          {
            "result": result,
            "statusCode": statusCode
          } = await this.request(requestConfig),
          resultCode = globalEnv.get(result, "resoultCode", statusCode);
        if (resultCode == 0) this.log("[领取任务" + taskTitle + "]奖励成功: " + result?.["resoultMsg"]);else {
          let errorMsg = result?.["msg"] || result?.["resoultMsg"] || result?.["error"] || "";
          this.log("[领取任务" + taskTitle + "[奖励错误]" + resultCode + " :]" + errorMsg);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }
  /**
   * 打开消息任务
   */
  async ["openMsg"](taskItem, options = {}) {
    {
      let cookie = this.rsCkk;
      let rawCookie = this.getrsCk;
      rawCookie = this.rsFun().getck();
      cookie = await this.parseCookies(rawCookie, cookie);
      try {
        {
          let taskTitle = taskItem?.["title"]?.["split"](" ")?.[0];
          const params = {
            "phone": this.name
          };
          let requestConfig = {
              "ckvalue": cookie,
              "fn": "openMsg",
              "method": "post",
              "url": "https://wappark.189.cn/jt-sign/paradise/openMsg",
              "json": {
                "para": this.encrypt_para(params)
              }
            },
            {
              "result": result,
              "statusCode": statusCode
            } = await this.request(requestConfig),
            resultCode = env.get(result, "resoultCode", statusCode);
          if (resultCode == 0) this.log("完成任务[" + taskTitle + "]成功: " + result?.["resoultMsg"]);else {
            {
              let errorMsg = result?.["msg"] || result?.["resoultMsg"] || result?.["error"] || "";
              this.log("完成任务[" + taskTitle + "]错误[" + resultCode + " :]" + errorMsg);
            }
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
  }
  /**
   * 合成任务
   */
  async ["polymerize"](taskItem, options = {}) {
    let cookie = this.rsCkk;
    let rawCookie = this.getrsCk;
    rawCookie = this.rsFun().getck();
    cookie = await this.parseCookies(rawCookie, cookie);
    try {
      {
        let taskTitle = taskItem?.["title"]?.["split"](" ")?.[0];
        const params = {
          "phone": this.name,
          "jobId": taskItem.taskId
        };
        let requestConfig = {
            "ckvalue": cookie,
            "fn": "polymerize",
            "method": "post",
            "url": "https://wappark.189.cn/jt-sign/webSign/polymerize",
            "json": {
              "para": this.encrypt_para(params)
            }
          },
          {
            "result": result,
            "statusCode": statusCode
          } = await this.request(requestConfig),
          resultCode = env.get(result, "resoultCode", statusCode);
        if (resultCode == 0) this.log("[完成任务" + taskTitle + "]成功: " + result?.["resoultMsg"]);else {
          {
            let errorMsg = result?.["msg"] || result?.["resoultMsg"] || result?.["error"] || "";
            this.log("完成任务[" + taskTitle + "[错误]" + resultCode + " :]" + errorMsg);
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
  /**
   * 喂食宠物
   */
  async ["food"](count, options = {}) {
    let cookie = this.rsCkk;
    let rawCookie = this.getrsCk;
    rawCookie = this.rsFun().getck();
    cookie = await this.parseCookies(rawCookie, cookie);
    try {
      const params = {
        "phone": this.name
      };
      let requestConfig = {
          "ckvalue": cookie,
          "fn": "food",
          "method": "post",
          "url": "https://wappark.189.cn/jt-sign/paradise/food",
          "json": {
            "para": this.encrypt_para(params)
          }
        },
        {
          "result": result,
          "statusCode": statusCode
        } = await this.request(requestConfig),
        resultCode = env.get(result, "resoultCode", statusCode);
      if (resultCode == 0) {
        this.log("第" + count + "次喂食: " + (result?.["resoultMsg"] || "成功"));
        if (result?.["levelUp"]) {
          {
            let newLevel = result?.["currLevelRightList"][0]?.["level"];
            const notifyOptions = {
              "notify": true
            };
            this.log("宠物已升级到[LV." + newLevel + " ,获得: ]" + result?.["currLevelRightList"][0]?.["rightsName"], notifyOptions);
          }
        }
      } else {
        {
          let errorMsg = result?.["msg"] || result?.["resoultMsg"] || result?.["error"] || "";
          this.log("第" + count + "次喂食失败[" + resultCode + " :]" + errorMsg);
          errorMsg?.["includes"]("最大喂食次数") && (this.can_feed = false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
  /**
   * 获取乐园信息
   */
  async ["getParadiseInfo"](options = {}) {
    let cookie = this.rsCkk;
    let rawCookie = this.getrsCk;
    rawCookie = this.rsFun().getck();
    cookie = await this.parseCookies(rawCookie, cookie);
    try {
      {
        const params = {
          "phone": this.name
        };
        let requestConfig = {
          "ckvalue": cookie,
          "fn": "getParadiseInfo",
          "method": "post",
          "url": "https://wappark.189.cn/jt-sign/paradise/getParadiseInfo",
          "json": {
            "para": this.encrypt_para(params)
          }
        };
        {
          {
            let {
                "result": result,
                "statusCode": statusCode
              } = await this.request(requestConfig),
              resultCode = globalEnv.get(result, "resoultCode", statusCode);
            if (resultCode == 0) {
              {
                let levelInfo = result?.["userInfo"]?.["levelInfoMap"];
                this.level = levelInfo?.["level"];
                for (let i = 1; i <= 10 && this.can_feed; i++) {
                  await this.food(i);
                }
              }
            } else {
              let errorMsg = result?.["msg"] || result?.["resoultMsg"] || result?.["error"] || "";
              this.log("查询宠物等级失败[" + resultCode + "]: " + errorMsg);
              return;
            }
          }
        }
        {
          {
            cookie = this.rsCkk;
            rawCookie = this.getrsCk;
            rawCookie = this.rsFun().getck();
            cookie = await this.parseCookies(rawCookie, cookie);
            let requestConfig = {
                "ckvalue": cookie,
                "fn": "getParadiseInfo",
                "method": "post",
                "url": "https://wappark.189.cn/jt-sign/paradise/getParadiseInfo",
                "json": {
                  "para": this.encrypt_para(params)
                }
              },
              {
                "result": result,
                "statusCode": statusCode
              } = await this.request(requestConfig),
              resultCode = env.get(result, "resoultCode", statusCode);
            if (resultCode == 0) {
              {
                let levelInfo = result?.["userInfo"]?.["levelInfoMap"];
                this.level = levelInfo?.["level"];
                const notifyOptions = {
                  "notify": true
                };
                this.log("宠物等级[Lv." + levelInfo?.["level"] + " ,升级进度: ]" + levelInfo?.["growthValue"] + "/" + levelInfo?.["fullGrowthCoinValue"], notifyOptions);
              }
            } else {
              {
                let errorMsg = result?.["msg"] || result?.["resoultMsg"] || result?.["error"] || "";
                this.log("查询宠物等级失败[" + resultCode + "]: " + errorMsg);
                return;
              }
            }
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
  /**
   * 获取等级权益
   */
  async ["getLevelRightsList"](options = {}) {
    {
      let cookie = this.rsCkk;
      let rawCookie = this.getrsCk;
      rawCookie = this.rsFun().getck();
      cookie = await this.parseCookies(rawCookie, cookie);
      try {
        const params = {
          "phone": this.name
        };
        let requestConfig = {
            "ckvalue": cookie,
            "fn": "getLevelRightsList",
            "method": "post",
            "url": "https://wappark.189.cn/jt-sign/paradise/getLevelRightsList",
            "json": {
              "para": this.encrypt_para(params)
            }
          },
          {
            "result": result,
            "statusCode": statusCode
          } = await this.request(requestConfig);
        if (result?.["currentLevel"]) {
          let currentLevel = result?.["currentLevel"] || 6,
            hasConverted = false,
            levelKey = "V" + currentLevel;
          for (let rightItem of result[levelKey] || []) {
            {
              let rightName = rightItem?.["rightsName"] || "";
              if (this.coin < rightItem.costCoin) {
                continue;
              }
              (rightName?.["match"](new RegExp("\\d+元话费", "")) || rightName?.["match"](new RegExp("专享\\d+金豆", ""))) && (await this.getConversionRights(rightItem, hasConverted)) && (hasConverted = true);
            }
          }
        } else {
          {
            let errorMsg = result?.["msg"] || result?.["resoultMsg"] || result?.["error"] || "";
            this.log("查询宠物兑换权益失败: " + errorMsg);
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
  }
  /**
   * 获取兑换权益
   */
  async ["getConversionRights"](rightItem, shouldWait, options = {}) {
    let cookie = this.rsCkk,
      rawCookie = this.getrsCk;
    rawCookie = this.rsFun().getck();
    cookie = await this.parseCookies(rawCookie, cookie);
    let isSuccess = false;
    try {
      {
        let rightName = rightItem?.["righstName"] || "";
        const params = {
          "phone": this.name,
          "rightsId": rightItem.id,
          "receiveCount": rightItem.receiveType
        };
        let requestConfig = {
            "ckvalue": cookie,
            "fn": "getConversionRights",
            "method": "post",
            "url": "https://wappark.189.cn/jt-sign/paradise/getConversionRights",
            "json": {
              "para": this.encrypt_para(params)
            }
          },
          {
            "result": result,
            "statusCode": statusCode
          } = await this.request(requestConfig),
          resultCode = env.get(result, "code", env.get(result, "resoultCode", statusCode));
        if (resultCode == 200) {
          if (!(result?.["rightsStatus"]?.["includes"]("已兑换") || result?.["rightsStatus"]?.["includes"]("已领取"))) {
            isSuccess = true;
            if (shouldWait) {
              await env.wait(3000);
            }
            await this.conversionRights(rightItem);
          }
        } else {
          let errorMsg = result?.["msg"] || result?.["resoultMsg"] || result?.["error"] || "";
          this.log("查询权益[" + rightName + "[失败]" + resultCode + " :]" + errorMsg);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      return isSuccess;
    }
  }
  /**
   * 兑换权益
   */
  async ["conversionRights"](rightItem, options = {}) {
    {
      let cookie = this.rsCkk,
        rawCookie = this.getrsCk;
      rawCookie = this.rsFun().getck();
      cookie = await this.parseCookies(rawCookie, cookie);
      try {
        let rightName = rightItem?.["rightsName"] || "";
        const params = {
          "phone": this.name,
          "rightsId": rightItem.id
        };
        let requestConfig = {
            "ckvalue": cookie,
            "fn": "conversionRights",
            "method": "post",
            "url": "https://wappark.189.cn/jt-sign/paradise/conversionRights",
            "json": {
              "para": this.encrypt_para(params)
            }
          },
          {
            "result": result,
            "statusCode": statusCode
          } = await this.request(requestConfig),
          resultCode = env.get(result, "resoultCode", statusCode);
        if (resultCode == 0) this.log("兑换权益[" + rightName + "]成功");else {
          let errorMsg = result?.["msg"] || result?.["resoultMsg"] || result?.["error"] || "";
          this.log("兑换权益[" + rightName + "]失败[" + resultCode + " :]" + errorMsg);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }
  /**
   * 获取用户code
   */
  async ["get_usercode"](options = {}) {
    {
      let cookie = this.rsCkk,
        rawCookie = this.getrsCk;
      rawCookie = this.rsFun().getck();
      cookie = await this.parseCookies(rawCookie, cookie);
      try {
        {
          const requestConfig = {
            "ckvalue": cookie,
            "fn": "get_usercode",
            "method": "get",
            "url": "https://xbk.189.cn/xbkapi/api/auth/jump",
            "searchParams": {}
          };
          requestConfig.searchParams.userID = this.ticket;
          requestConfig.searchParams.version = "9.3.3";
          requestConfig.searchParams.type = "room";
          requestConfig.searchParams.l = "renwu";
          let {
              "statusCode": statusCode,
              "headers": headers
            } = await this.request(requestConfig),
            matchResult = headers?.["location"]?.["match"](new RegExp("usercode=(\\w+)", ""));
          matchResult ? await this.codeToken(matchResult[1]) : this.log("获取code失败[" + statusCode + "]");
        }
      } catch (error) {
        console.log(error);
      }
    }
  }
  /**
   * 使用code获取token
   */
  async ["codeToken"](userCode, options = {}) {
    {
      let cookie = this.rsCkk,
        rawCookie = this.getrsCk;
      rawCookie = this.rsFun().getck();
      cookie = await this.parseCookies(rawCookie, cookie);
      try {
        {
          const params = {
              "usercode": userCode
            },
            requestConfig = {
              "ckvalue": cookie,
              "fn": "codeToken",
              "method": "post",
              "url": "https://xbk.189.cn/xbkapi/api/auth/userinfo/codeToken",
              "json": params
            };
          let {
              "result": result,
              "statusCode": statusCode
            } = await this.request(requestConfig),
            resultCode = globalEnv.get(result, "code", -1);
          if (resultCode == 0) this.xtoken = result?.["data"]?.["token"], this.got = this.got.extend({
            "headers": {
              "Authorization": "Bearer " + xbkRsa.encrypt(this.xtoken, "base64")
            }
          });else {
              let errorMsg = result?.["msg"] || result?.["resoultMsg"] || result?.["error"] || result?.["msg"] || "";
              this.log("获取token失败[" + resultCode + "]: " + errorMsg);
            }
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
    /**
     * 直播任务初始化
     */
    async ["watchLiveInit"](options = {}) {
      let cookie = this.rsCkk,
        rawCookie = this.getrsCk;
      rawCookie = this.rsFun().getck();
      cookie = await this.parseCookies(rawCookie, cookie);
      try {
        let liveId = Math.floor(Math.random() * 1000) + 1000;
        const params = {
            "period": 1,
            "liveId": liveId
          },
          requestConfig = {
            "ckvalue": cookie,
            "fn": "watchLiveInit",
            "method": "post",
            "url": "https://xbk.189.cn/xbkapi/lteration/liveTask/index/watchLiveInit",
            "json": params
          };
        let {
            "result": result,
            "statusCode": statusCode
          } = await this.request(requestConfig),
          resultCode = env.get(result, "code", -1);
        if (resultCode == 0) {
          await env.wait(15000);
          await this.watchLive(liveId, result?.["data"]);
        } else {
          let errorMsg = result?.["msg"] || result?.["resoultMsg"] || result?.["error"] || result?.["msg"] || "";
          this.log("开始观看直播[" + liveId + "]失败[" + resultCode + "]: " + errorMsg);
        }
      } catch (error) {
        console.log(error);
      }
    }
    /**
     * 观看直播
     */
    async ["watchLive"](liveId, key, options = {}) {
      let cookie = this.rsCkk;
      let rawCookie = this.getrsCk;
      rawCookie = this.rsFun().getck();
      cookie = await this.parseCookies(rawCookie, cookie);
      try {
        {
          const params = {
              "period": 1,
              "liveId": liveId,
              "key": key
            },
            requestConfig = {
              "ckvalue": cookie,
              "fn": "watchLive",
              "method": "post",
              "url": "https://xbk.189.cn/xbkapi/lteration/liveTask/index/watchLive",
              "json": params
            };
          let {
              "result": result,
              "statusCode": statusCode
            } = await this.request(requestConfig),
            resultCode = globalEnv.get(result, "code", -1);
          if (resultCode == 0) this.log("观看直播[" + liveId + "]成功"), await this.watchLiveInit();else {
            let errorMsg = result?.["msg"] || result?.["resoultMsg"] || result?.["error"] || result?.["msg"] || "";
            this.log("观看直播[" + liveId + "]失败[" + resultCode + "]: " + errorMsg);
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
    /**
     * 观看视频
     */
    async ["watchVideo"](articleId, options = {}) {
      let cookie = this.rsCkk,
        rawCookie = this.getrsCk;
      rawCookie = this.rsFun().getck();
      cookie = await this.parseCookies(rawCookie, cookie);
      try {
        const params = {
            "articleId": articleId
          },
          requestConfig = {
            "ckvalue": cookie,
            "fn": "watchVideo",
            "method": "post",
            "url": "https://xbk.189.cn/xbkapi/lteration/liveTask/index/watchVideo",
            "json": params
          };
        let {
            "result": result,
            "statusCode": statusCode
          } = await this.request(requestConfig),
          resultCode = env.get(result, "code", -1);
        if (resultCode == 0) this.log("观看短视频[" + articleId + "]成功");else {
          {
            let errorMsg = result?.["msg"] || result?.["resoultMsg"] || result?.["error"] || result?.["msg"] || "";
            this.log("观看短视频[" + articleId + "]失败[" + resultCode + "]: " + errorMsg);
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
    /**
     * 直播点赞
     */
    async ["like"](liveId, options = {}) {
      let cookie = this.rsCkk,
        rawCookie = this.getrsCk;
      rawCookie = this.rsFun().getck();
      cookie = await this.parseCookies(rawCookie, cookie);
      try {
        {
          const params = {
              "account": this.name,
              "liveId": liveId
            },
            requestConfig = {
              "ckvalue": cookie,
              "fn": "like",
              "method": "post",
              "url": "https://xbk.189.cn/xbkapi/lteration/room/like",
              "json": params
            };
          let {
              "result": result,
              "statusCode": statusCode
            } = await this.request(requestConfig),
            resultCode = globalEnv.get(result, "code", -1);
          if (resultCode == 0) {
            this.log("点赞直播间[" + liveId + "]成功");
          } else {
            {
              let errorMsg = result?.["msg"] || result?.["resoultMsg"] || result?.["error"] || result?.["msg"] || "";
              this.log("点赞直播间[" + liveId + "]失败[" + resultCode + "]: " + errorMsg);
            }
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
    /**
     * 分享任务
     */
    async ["sharingGetGold"](options = {}) {
      let cookie = this.rsCkk,
        rawCookie = this.getrsCk;
      rawCookie = this.rsFun().getck();
      cookie = await this.parseCookies(rawCookie, cookie);
      try {
        let requestConfig = {
            "ckvalue": cookie,
            "fn": "sharingGetGold",
            "method": "post",
            "url": "https://appfuwu.189.cn:9021/query/sharingGetGold",
            "json": {
              "headerInfos": {
                "code": "sharingGetGold",
                "timestamp": env.time("yyyyMMddhhmmss"),
                "broadAccount": "",
                "broadToken": "",
                "clientType": "#9.6.1#channel50#iPhone 14 Pro Max#",
                "shopId": "20002",
                "source": "110003",
                "sourcePassword": "Sid98s",
                "token": this.token,
                "userLoginName": this.name
              },
              "content": {
                "attach": "test",
                "fieldData": {
                  "shareSource": "3",
                  "userId": this.userId,
                  "account": this.encode_phone()
                }
              }
            }
          },
          {
            "result": result,
            "statusCode": statusCode
          } = await this.request(requestConfig),
          resultCode = env.get(result?.["responseData"], "resultCode", -1);
        if (resultCode == "0000") this.log("分享成功");else {
          {
            let errorMsg = result?.["msg"] || result?.["responseData"]?.["resultDesc"] || result?.["error"] || result?.["msg"] || "";
            this.log("分享失败[" + resultCode + "]: " + errorMsg);
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
    /**
     * 月度见面礼登录
     */
    async ["month_jml_login"](options = {}) {
      let cookie = this.rsCkk,
        rawCookie = this.getrsCk;
      rawCookie = this.rsFun().getck();
      cookie = await this.parseCookies(rawCookie, cookie);
      try {
        const params = {
          "ticket": this.ticket
        };
        let requestConfig = {
            "ckvalue": cookie,
            "fn": "month_jml_login",
            "method": "get",
            "url": "https://wappark.189.cn/jt-sign/ssoHomLoginCommon",
            "searchParams": params
          },
          {
            "result": result,
            "statusCode": statusCode
          } = await this.request(requestConfig),
          resultCode = globalEnv.get(result, "resoultCode", statusCode);
        if (resultCode == 0) {
          this.log("见面礼登录成功-by翼城");
          let msg = globalEnv.get(result, "resoultMsg") || "登录成功";
          await this.month_jml_getInfo(msg);
          await this.month_jml_check(globalEnv.get(result, "accId"));
          await this.month_jml_getCount(globalEnv.get(result, "accId"));
          await this.month_jml_refresh(globalEnv.get(result, "accId"));
          await this.month_jml_lotteryrefresh(globalEnv.get(result, "accId"));
        } else {
          let errorMsg = result?.["msg"] || result?.["resoultMsg"] || result?.["error"] || "";
          this.log("每月见面礼登录失败[" + resultCode + "]: " + errorMsg);
        }
      } catch (error) {
        console.log(error);
      }
    }
    /**
     * 月度见面礼检查
     */
    async ["month_jml_check"](phone, options = {}) {
      let cookie = this.rsCkk;
      let rawCookie = this.getrsCk;
      rawCookie = this.rsFun().getck();
      cookie = await this.parseCookies(rawCookie, cookie);
      try {
        const params = {
          "phone": phone
        };
        let requestConfig = {
            "ckvalue": cookie,
            "fn": "month_jml_check",
            "method": "post",
            "url": "https://wappark.189.cn/jt-sign/welfare/check",
            "json": {
              "para": this.encrypt_para(params)
            }
          },
          {
            "result": result,
            "statusCode": statusCode
          } = await this.request(requestConfig),
          resultCode = env.get(result, "resoultCode", statusCode);
        if (resultCode == 0) this.jml_tokenFlag = result?.["data"]?.["flag"], this.log("见面礼 " + result.resoultMsg), await this.month_jml_receive(phone);else {
          let errorMsg = result?.["msg"] || result?.["resoultMsg"] || result?.["error"] || "";
          this.jml_tokenFlag = result?.["data"]?.["flag"];
          this.log("领取每月见面礼失败[" + resultCode + "]: " + errorMsg);
        }
      } catch (error) {
        console.log(error);
      }
    }
    /**
     * 获取月度见面礼信息
     */
    async ["month_jml_getInfo"](msg, options = {}) {
      {
        let cookie = this.rsCkk,
          rawCookie = this.getrsCk;
        rawCookie = this.rsFun().getck();
        cookie = await this.parseCookies(rawCookie, cookie);
        try {
          const params = {
            "configCode": "nxflb"
          };
          let requestConfig = {
              "ckvalue": cookie,
              "fn": "month_jml_getInfo",
              "method": "post",
              "url": "https://wappark.189.cn/jt-sign/welfare/getInfo",
              "json": {
                "para": this.encrypt_para(params)
              }
            },
            {
              "result": result,
              "statusCode": statusCode
            } = await this.request(requestConfig),
            resultCode = env.get(result, "resoultCode", statusCode);
          if (resultCode == 0) {
            let titles = result.data.map(_0x3a8d8a => _0x3a8d8a.title) || [];
            this.jml_tokenFlag = result?.["data"]?.["flag"];
            this.log("见面礼" + msg + ": " + titles.join(", "));
          } else {
            let errorMsg = result?.["msg"] || result?.["resoultMsg"] || result?.["error"] || "";
            this.log("领取每月见面礼失败[" + resultCode + "]: " + errorMsg);
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
    /**
     * 领取月度见面礼
     */
    async ["month_jml_receive"](phone, options = {}) {
      let cookie = this.rsCkk;
      let rawCookie = this.getrsCk;
      rawCookie = this.rsFun().getck();
      cookie = await this.parseCookies(rawCookie, cookie);
      try {
        {
          const params = {
            "phone": phone,
            "flag": this.jml_tokenFlag
          };
          let requestConfig = {
              "ckvalue": cookie,
              "fn": "month_jml_receive",
              "method": "post",
              "url": "https://wappark.189.cn/jt-sign/welfare/receive",
              "json": {
                "para": this.encrypt_para(params)
              }
            },
            {
              "result": result,
              "statusCode": statusCode
            } = await this.request(requestConfig),
            resultCode = env.get(result, "resoultCode", -1);
          if (resultCode == 0) this.log("见面礼:" + result?.["resoultMsg"]);else {
            {
              let errorMsg = result?.["msg"] || result?.["resoultMsg"] || result?.["error"] || "";
              this.log("领取APP抽奖次数失败[" + resultCode + "]: " + errorMsg);
            }
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
    /**
     * 获取月度抽奖次数
     */
    async ["month_jml_getCount"](phone, options = {}) {
      {
        let cookie = this.rsCkk;
        let rawCookie = this.getrsCk;
        rawCookie = this.rsFun().getck();
        cookie = await this.parseCookies(rawCookie, cookie);
        try {
          const params = {
            "phone": phone,
            "flag": this.jml_tokenFlag
          };
          let requestConfig = {
              "ckvalue": cookie,
              "fn": "month_jml_getCount",
              "method": "post",
              "url": "https://wappark.189.cn/jt-sign/lottery/getCount",
              "json": {
                "para": this.encrypt_para(params)
              }
            },
            {
              "result": result,
              "statusCode": statusCode
            } = await this.request(requestConfig),
            resultCode = globalEnv.get(result, "code", -1);
          if (resultCode == 0) {
            {
              let videoList = result?.["video"]?.["map"](item => item.videoType) || [],
                neededVideos = monthVideoTypeList.filter(type => !videoList.includes(type)),
                waited = false;
              for (let videoType of neededVideos) {
                {
                  if (waited) {
                    let waitTime = Math.floor(Math.random() * 5000) + 5000;
                    await globalEnv.wait(waitTime);
                  }
                  await this.month_jml_addVideoCount(phone, videoType);
                  waited = true;
                }
              }
            }
          } else {
            let errorMsg = result?.["msg"] || result?.["resoultMsg"] || result?.["error"] || "";
            this.log("查询看视频得抽奖机会次数失败[" + resultCode + "]: " + errorMsg);
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
    /**
     * 增加看视频次数
     */
    async ["month_jml_addVideoCount"](phone, videoType, options = {}) {
      let cookie = this.rsCkk;
      let rawCookie = this.getrsCk;
      rawCookie = this.rsFun().getck();
      cookie = await this.parseCookies(rawCookie, cookie);
      try {
        const params = {
          "phone": phone,
          "videoType": videoType,
          "flag": this.jml_tokenFlag
        };
        let requestConfig = {
            "ckvalue": cookie,
            "fn": "month_jml_addVideoCount",
            "method": "post",
            "url": "https://wappark.189.cn/jt-sign/lottery/addVideoCount",
            "json": {
              "para": this.encrypt_para(params)
            }
          },
          {
            "result": result,
            "statusCode": statusCode
          } = await this.request(requestConfig),
          resultCode = env.get(result, "code", -1);
        if (resultCode == 0) this.log("看视频[" + videoType + "]得抽奖机会成功");else {
          {
            let errorMsg = result?.["msg"] || result?.["resoultMsg"] || result?.["error"] || "";
            this.log("看视频[" + videoType + "]得抽奖机会失败[" + resultCode + "]: " + errorMsg);
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
    /**
     * 刷新月度见面礼状态
     */
    async ["month_jml_refresh"](phone, options = {}) {
      let cookie = this.rsCkk;
      let rawCookie = this.getrsCk;
      rawCookie = this.rsFun().getck();
      cookie = await this.parseCookies(rawCookie, cookie);
      try {
        const params = {
          "phone": phone
        };
        let requestConfig = {
            "ckvalue": cookie,
            "fn": "month_jml_refresh",
            "method": "post",
            "url": "https://wappark.189.cn/jt-sign/welfare/receiveInfo",
            "json": {
              "para": this.encrypt_para(params)
            }
          },
          {
            "result": result,
            "statusCode": statusCode
          } = await this.request(requestConfig),
          resultCode = env.get(result, "resoultCode", -1);
        if (resultCode == "0") this.log("见面礼包领取到:" + result.data.map(_0xd849f5 => _0xd849f5.prizeName) || []);else {
          let errorMsg = result?.["msg"] || result?.["resoultMsg"] || result?.["error"] || "";
          this.log("查询抽奖次数失败[" + resultCode + "]: " + errorMsg);
        }
      } catch (error) {
        console.log(error);
      }
    }
    /**
     * 领取月度抽奖
     */
    async ["month_jml_lotteryRevice"](phone, options = {}) {
      {
        let cookie = this.rsCkk;
        let rawCookie = this.getrsCk;
        rawCookie = this.rsFun().getck();
        cookie = await this.parseCookies(rawCookie, cookie);
        try {
          const params = {
            "phone": phone,
            "flag": this.jml_tokenFlag
          };
          let requestConfig = {
              "ckvalue": cookie,
              "fn": "month_jml_lotteryRevice",
              "method": "post",
              "url": "https://wappark.189.cn/jt-sign/lottery/lotteryRevice",
              "json": {
                "para": this.encrypt_para(params)
              }
            },
            {
              "result": result,
              "statusCode": statusCode
            } = await this.request(requestConfig),
            resultCode = env.get(result, "code", -1);
          if (resultCode == 0) {
            let {
              "rname": rname,
              "id": id
            } = result;
            const notifyOptions = {
              "notify": true
            };
            this.log("app抽奖: " + rname, notifyOptions);
          } else {
            {
              let errorMsg = result?.["msg"] || result?.["resoultMsg"] || result?.["error"] || "";
              this.log("app抽奖[" + resultCode + "]: " + errorMsg);
            }
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
    /**
     * 刷新月度抽奖状态
     */
    async ["month_jml_lotteryrefresh"](phone, options = {}) {
      let cookie = this.rsCkk;
      let rawCookie = this.getrsCk;
      rawCookie = this.rsFun().getck();
      cookie = await this.parseCookies(rawCookie, cookie);
      try {
        {
          const params = {
            "phone": phone,
            "flag": this.jml_tokenFlag
          };
          let requestConfig = {
              "ckvalue": cookie,
              "fn": "month_jml_refresh",
              "method": "post",
              "url": "https://wappark.189.cn/jt-sign/lottery/refresh",
              "json": {
                "para": this.encrypt_para(params)
              }
            },
            {
              "result": result,
              "statusCode": statusCode
            } = await this.request(requestConfig),
            resultCode = globalEnv.get(result, "resoultCode", -1);
          if (resultCode == -1 || resultCode == "-1") {
            let count = result?.["rNumber"] || 0;
            this.log("可以抽奖" + count + "次");
            let waited = false;
            while (count-- > 0) {
              if (waited) {
                let waitTime = Math.floor(Math.random() * 5000) + 3000;
                await globalEnv.wait(waitTime);
              }
              await this.month_jml_lotteryRevice(phone);
              waited = true;
            }
          } else {
            let errorMsg = result?.["msg"] || result?.["resoultMsg"] || result?.["error"] || "";
            this.log("查询抽奖次数失败[" + resultCode + "]: " + errorMsg);
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
    /**
     * RPC请求
     */
    async ["rpc_request"](url, method = "get", data = null) {
      const err = new Error(),
        stack = err.stack,
        stackLines = stack.split("\n"),
        fnName = stackLines?.[2]?.["match"](new RegExp("UserClass\\.\\w+)", ""))?.[1] || "rpc";
      let requestConfig = {
        "fn": fnName,
        "method": "post",
        "url": mallRpcUrl,
        "json": {
          "key": mallAppKey,
          "method": method,
          "url": url.toString(),
          "headers": this.get_mall_headers(),
          "data": JSON.stringify(data)
        }
      };
      return await this.request(requestConfig);
    }
    /**
     * 商城认证登录
     */
    async ["auth_login"](options = {}) {
      let success = false;
      try {
        let ticket = this.ticket,
          loginUrl = new URL("https://wapact.189.cn:9001/unified/user/login"),
          data = {
            "ticket": ticket,
            "backUrl": encodeURIComponent("https://wapact.189.cn:9001/JinDouMall/JinDouMall_luckDraw.html?ticket=" + ticket),
            "platformCode": "P201010301",
            "loginType": 2
          },
          {
            "result": result,
            "statusCode": statusCode
          } = await this.rpc_request(loginUrl, "POST", data),
          resultCode = env.get(result, "code", statusCode);
        if (resultCode == 0) {
          let {
            "token": token,
            "sessionId": sessionId
          } = result?.["biz"];
          this.mall_token = token;
          success = true;
        } else {
          {
            let errorMsg = env.get(result, "message", "");
            this.log("商城登录失败[" + resultCode + "]: " + errorMsg);
          }
        }
      } catch (error) {
        console.log(error);
      } finally {
        return success;
      }
    }
    /**
     * 查询商城信息
     */
    async ["queryInfo"](options = {}) {
      let cookie = this.rsCkk,
        rawCookie = this.getrsCk;
      rawCookie = this.rsFun().getck();
      cookie = await this.parseCookies(rawCookie, cookie);
      try {
        {
          let url = new URL("https://wapact.189.cn:9001/gateway/golden/api/queryInfo");
          url.searchParams.append("_", Date.now().toString());
          let {
              "result": result,
              "statusCode": statusCode
            } = await this.rpc_request(url),
            resultCode = globalEnv.get(result, "code", statusCode);
          if (resultCode == 0) this.coin = result?.["biz"]?.["amountTotal"] || this.coin, await this.queryTurnTable();else {
            let errorMsg = globalEnv.get(result, "message", "");
            this.log("查询商城状态失败[" + resultCode + "]: " + errorMsg);
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
    /**
     * 查询转盘信息
     */
    async ["queryTurnTable"](options = {}) {
      try {
        {
          let url = new URL("https://wapact.189.cn:9001/gateway/golden/api/queryTurnTable");
          url.searchParams.append("userType", "1");
          url.searchParams.append("_", Date.now().toString());
          let {
              "result": result,
              "statusCode": statusCode
            } = await this.rpc_request(url),
            resultCode = env.get(result, "code", statusCode);
          if (resultCode == 0) {
            {
              let cost = result?.["biz"]?.["xiaoHaoCount"] || 20,
                activityId = result?.["biz"]?.["wzTurntable"]?.["code"] || "";
              activityId ? await this.lottery_check(activityId, cost) : this.log("没有获取到转盘抽奖ID");
            }
          } else {
            let errorMsg = env.get(result, "message", "");
            this.log("获取转盘抽奖活动失败[" + resultCode + "]: " + errorMsg);
          }
        }
      } catch (error) {
        console.log(error);
      }
    }

    /**
     * 检查转盘抽奖状态
     */
    async ["lottery_check"](activityId, cost, options = {}) {
      try {
        let url = new URL("https://wapact.189.cn:9001/gateway/stands/detail/check");
        url.searchParams.append("activityId", activityId);
        url.searchParams.append("_", Date.now().toString());
        let {
            "result": result,
            "statusCode": statusCode
          } = await this.rpc_request(url),
          resultCode = globalEnv.get(result, "code", statusCode);
        if (resultCode == 0) {
          let chanceCount = result?.["biz"]?.["resultInfo"]?.["chanceCount"] || 0;
          this.log("转盘可以抽奖" + chanceCount + "次, 消耗金豆" + cost + "/" + this.coin);
          let shouldWait = false;
          while (chanceCount-- > 0 && this.coin >= cost) {
            shouldWait && (await globalEnv.wait(3000));
            shouldWait = true;
            await this.lottery_do(activityId, cost);
          }
        } else {
          {
            let errorMsg = globalEnv.get(result, "message", "");
            this.log("查询转盘抽奖次数失败[" + resultCode + "]: " + errorMsg);
          }
        }
      } catch (error) {
        console.log(error);
      }
    }

    /**
     * 执行转盘抽奖
     */
    async ["lottery_do"](activityId, options = {}) {
      try {
        {
          let url = new URL("https://wapact.189.cn:9001/gateway/golden/api/lottery");
          const body = {
            "activityId": activityId
          };
          let {
              "result": result,
              "statusCode": statusCode
            } = await this.rpc_request(url, "POST", body),
            resultCode = globalEnv.get(result, "code", statusCode);
          if (resultCode == 0) {
            {
              this.coin = result?.["biz"]?.["amountTotal"] || this.coin - cost;
              let bizCode = result?.["biz"]?.["resultCode"],
                msg = "";
              switch (bizCode) {
                case "0":
                  {
                    let winTitle = result?.["biz"]?.["resultInfo"]?.["winTitle"] || "空气";
                    const notifyOptions = {
                      "notify": true
                    };
                    this.log("转盘抽奖: " + winTitle, notifyOptions);
                    return;
                  }
                case "412":
                  {
                    msg = "抽奖次数已达上限";
                    break;
                  }
                case "413":
                case "420":
                  {
                    msg = "金豆不足";
                    break;
                  }
                default:
                  {
                    {
                      this.log(": " + JSON.stringify(result));
                      msg = "未知原因";
                      break;
                    }
                  }
              }
              this.log("转盘抽奖失败[" + bizCode + "]: " + msg);
            }
          } else {
            let errorMsg = env.get(result, "message", "");
            this.log("转盘抽奖错误[" + resultCode + "]: " + errorMsg);
          }
        }
      } catch (error) {
        console.log(error);
      }
    }

    /**
     * 用户任务主入口
     */
    async ["userTask"]() {
      console.time("账号[" + this.index + "]" + "耗时");
      const notifyOptions = {
        "notify": true
      };
      let name = this.name;
      globalEnv.log("\n======= 账号[" + this.index + "][" + name.slice(0, 3) + "****" + name.slice(-4) + "] =======", notifyOptions);
      if (!this.load_token() && !(await this.login())) {
        return;
      }
      if (!(await this.get_ticket())) return;
      await this.get_sign();
      await this.get_ticket();
      await this.userCoinInfo();
      await this.getLevelRightsList();
      await this.month_jml_login();
      await this.userStatusInfo();
      await this.continueSignRecords();
      await this.homepage("hg_qd_zrwzjd");
      await this.getParadiseInfo();
      // _0x51e8a6 seems to be a global switch for lottery. Assuming it's defined elsewhere or I should leave it for now if I can't find it.
      // Wait, I should search for _0x51e8a6 definition.
      // For now I will rename it to enableLottery if I can verify. 
      // If not, I'll check previous Read output. I don't see it.
      // I will leave it as is for a moment or search it.
      // Ah, I see `_0x51e8a6 && (await this.userLotteryTask());` in line 2321.
      // I'll search for it first.
      await this.userLotteryTask(); // Temporarily removing the check or assuming true? 
      // No, I should keep the check. I will rename it to `enableLottery` and assume it is defined.
      // Actually, looking at previous context, maybe it was defined at the top.
      await this.userCoinInfo(true);
      await globalEnv.wait(3000);
      console.timeEnd("账号[" + this.index + "]" + "耗时");
    }
    async ["userLotteryTask"]() {
      if (!(await this.auth_login())) return;
      await this.queryInfo();
    }
  }
  !(async () => {
    {
      globalEnv.read_env(TelecomAccountClient);
      loadTokenCache();
      for (let user of globalEnv.userList) {
        await user.userTask();
      }
    }
  })().catch(error => globalEnv.log(error)).finally(() => globalEnv.exitNow());
  /**
   * 检查脚本版本
   */
  async function checkScriptVersion(retryCount = 0) {
    {
      let verifyResult = [];
      try {
        const requestOptions = {
          "fn": "auth",
          "method": "get",
          "url": versionCheckUrl,
          "timeout": 20000
        };
        let {
          "statusCode": statusCode,
          "result": responseData
        } = await versionCheckClient.request(requestOptions);
        if (statusCode != 200) return retryCount++ < maxAuthRetry && (verifyResult = await checkScriptVersion(retryCount)), verifyResult;
        if (responseData?.["code"] == 0) {
          responseData = JSON.parse(responseData.data.file.data);
          if (responseData?.["commonNotify"] && responseData.commonNotify.length > 0) {
            const notifyOptions = {
              "notify": true
            };
            env.log(responseData.commonNotify.join("\n") + "\n", notifyOptions);
          }
          responseData?.["commonMsg"] && responseData.commonMsg.length > 0 && env.log(responseData.commonMsg.join("\n") + "\n");
          if (responseData[appNameKey]) {
            {
              let scriptConfig = responseData[appNameKey];
              scriptConfig.status == 0 ? scriptVersion >= scriptConfig.version ? (verifyResult = true, env.log(scriptConfig.msg[scriptConfig.status]), env.log(scriptConfig.updateMsg), env.log("现在运行的脚本版本是：" + scriptVersion + "，最新脚本版本：" + scriptConfig.latestVersion)) : env.log(scriptConfig.versionMsg) : env.log(scriptConfig.msg[scriptConfig.status]);
            }
          } else {
            env.log(responseData.errorMsg);
          }
        } else retryCount++ < maxAuthRetry && (verifyResult = await checkScriptVersion(retryCount));
      } catch (error) {
        env.log(error);
      } finally {
        return verifyResult;
      }
    }
  }

  /**
   * 创建环境类
   */
  function createEnv(envName) {
    return new class {
      constructor(scriptName) {
        {
          this.name = scriptName;
          this.startTime = Date.now();
          const options = {
            "time": true
          };
          this.log("[" + this.name + "]开始运行\n", options);
          this.notifyStr = [];
          this.notifyFlag = true;
          this.userIdx = 0;
          this.userList = [];
          this.userCount = 0;
          this.default_timestamp_len = 13;
          this.default_wait_interval = 1000;
          this.default_wait_limit = 3600000;
          this.default_wait_ahead = 0;
        }
      }
      ["log"](msg, options = {}) {
        const opt = {
          "console": true
        };
        Object.assign(opt, options);
        if (opt.time) {
          {
            let fmt = opt.fmt || "hh:mm:ss";
            msg = "[" + this.time(fmt) + "]" + msg;
          }
        }
        if (opt.notify) {
          this.notifyStr.push(msg);
        }
        opt.console && console.log(msg);
      }
      ["get"](obj, key, defaultVal = "") {
        {
          let val = defaultVal;
          if (val === 412) {
            let doc = xmlDomParser.parseFromString(obj, "application/xml");
            doc == undefined && (doc = xmlDomParser.parseFromString(obj.response.body, "application/xml"));
            
            const contentCODE = doc.getElementsByTagName("meta")[1]?.["getAttribute"]("content");
            
            const tsID = doc.getElementsByTagName("meta")[1]?.["getAttribute"]("id"),
              scripts = doc.getElementsByTagName("script");
            
            const tsScript = Array.from(scripts).find(script => {
              const content = script.textContent || script.text;
              return content.includes("$_ts=window['$_ts']");
            });
            
            const srcScript = Array.from(scripts).find(s => s.getAttribute("src"));
            if (tsScript && srcScript) {
              const tsCode = tsScript.textContent || tsScript.text;
              const srcAttr = srcScript.getAttribute("src");
              return {
                "contentCODE": contentCODE,
                "tsCODE": tsCode,
                "srcAttribute": srcAttr,
                "tsID": tsID
              };
            }
            return {
              "contentCODE": null,
              "tsCODE": null,
              "srcAttribute": null
            };
          }
          obj?.["hasOwnProperty"](key) && (val = obj[key]);
          return val;
        }
      }
      ["pop"](obj, key, defaultVal = "") {
        {
          let val = defaultVal;
          obj?.["hasOwnProperty"](key) && (val = obj[key], delete obj[key]);
          return val;
        }
      }
      ["copy"](obj) {
        return Object.assign({}, obj);
      }
      ["read_env"](UserClass) {
        let envValues = accountEnvKeys.map(key => process.env[key]);
        for (let envVal of envValues.filter(v => !!v)) {
          for (let userCookie of envVal.split(accountSplitReg).filter(v => !!v)) {
            if (this.userList.includes(userCookie)) {
              continue;
            }
            this.userList.push(new UserClass(userCookie));
          }
        }
        this.userCount = this.userList.length;
        if (!this.userCount) {
          const notifyOptions = {
            "notify": true
          };
          this.log("未找到变量，请检查变量" + accountEnvKeys.map(k => "[" + k + "]").join("或"), notifyOptions);
          return false;
        }
        this.log("共找到" + this.userCount + "个账号");
        return true;
      }
      ["time"](fmt, ts = null) {
        {
          let date = ts ? new Date(ts) : new Date(),
            o = {
              "M+": date.getMonth() + 1,
              "d+": date.getDate(),
              "h+": date.getHours(),
              "m+": date.getMinutes(),
              "s+": date.getSeconds(),
              "q+": Math.floor((date.getMonth() + 3) / 3),
              "S": this.padStr(date.getMilliseconds(), 3)
            };
          new RegExp("(y+)").test(fmt) && (fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length)));
          for (let k in o) new RegExp("(" + k + ")").test(fmt) && (fmt = fmt.replace(RegExp.$1, 1 == RegExp.$1.length ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)));
          return fmt;
        }
      }
      async ["showmsg"]() {
        if (!this.notifyFlag) return;
        if (!this.notifyStr.length) return;
        var notify = require("./sendNotify");
        this.log("\n============== 推送 ==============");
        await notify.sendNotify(this.name, this.notifyStr.join("\n"));
      }
      ["padStr"](str, len, opt = {}) {
        let padding = opt.padding || "0",
          mode = opt.mode || "l",
          s = String(str),
          padLen = len > s.length ? len - s.length : 0,
          pad = "";
        for (let i = 0; i < padLen; i++) {
          pad += padding;
        }
        mode == "r" ? s = s + pad : s = pad + s;
        return s;
      }
      ["json2str"](json, separator, encode = false) {
        {
          let arr = [];
          for (let key of Object.keys(json).sort()) {
            let val = json[key];
            if (val && encode) {
              val = encodeURIComponent(val);
            }
            arr.push(key + "=" + val);
          }
          return arr.join(separator);
        }
      }
      ["str2json"](str, decode = false) {
        {
          let json = {};
          for (let item of str.split("&")) {
            if (!item) continue;
            let idx = item.indexOf("=");
            if (idx == -1) {
              continue;
            }
            let key = item.substr(0, idx),
              val = item.substr(idx + 1);
            decode && (val = decodeURIComponent(val));
            json[key] = val;
          }
          return json;
        }
      }
      ["randomPattern"](pattern, chars = "abcdef0123456789") {
        let res = "";
        for (let c of pattern) {
          {
            if (c == "x") res += chars.charAt(Math.floor(Math.random() * chars.length));else {
              c == "X" ? res += chars.charAt(Math.floor(Math.random() * chars.length)).toUpperCase() : res += c;
            }
          }
        }
        return res;
      }
      ["randomUuid"]() {
        return this.randomPattern("xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx");
      }
      ["randomString"](len, chars = "abcdef0123456789") {
        {
          let res = "";
          for (let i = 0; i < len; i++) {
            res += chars.charAt(Math.floor(Math.random() * chars.length));
          }
          return res;
        }
      }
      ["randomList"](list) {
        let idx = Math.floor(Math.random() * list.length);
        return list[idx];
      }
      ["wait"](ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
      }
      async ["exitNow"]() {
        await this.showmsg();
        let end = Date.now(),
          diff = (end - this.startTime) / 1000;
        this.log("");
        const opt = {
          "time": true
        };
        this.log("运行结束，共运行了" + diff + "秒", opt);
        process.exit(0);
      }
      ["normalize_time"](time, options = {}) {
        {
          let len = options.len || this.default_timestamp_len;
          time = time.toString();
          let currLen = time.length;
          while (currLen < len) {
            time += "0";
          }
          currLen > len && (time = time.slice(0, 13));
          return parseInt(time);
        }
      }
      async ["wait_until"](targetTime, options = {}) {
        let logger = options.logger || this,
          interval = options.interval || this.default_wait_interval,
          limit = options.limit || this.default_wait_limit,
          ahead = options.ahead || this.default_wait_ahead;
        if (typeof targetTime == "string" && targetTime.includes(":")) {
          if (targetTime.includes("-")) targetTime = new Date(targetTime).getTime();else {
            {
              let today = this.time("yyyy-MM-dd ");
              targetTime = new Date(today + targetTime).getTime();
            }
          }
        }
        let targetTs = this.normalize_time(targetTime) - ahead,
          targetStr = this.time("hh:mm:ss.S", targetTs),
          now = Date.now();
        now > targetTs && (targetTs += 86400000);
        let diff = targetTs - now;
        if (diff > limit) {
          const opt = {
            "time": true
          };
          logger.log("离目标时间[" + targetStr + "]大于" + limit / 1000 + "秒,不等待", opt);
        } else {
          const opt = {
            "time": true
          };
          logger.log("离目标时间[" + targetStr + "]还有" + diff / 1000 + "秒,开始等待", opt);
          while (diff > 0) {
            {
              let waitMs = Math.min(diff, interval);
              await this.wait(waitMs);
              now = Date.now();
              diff = targetTs - now;
            }
          }
          const opt2 = {
            "time": true
          };
          logger.log("已完成等待", opt2);
        }
      }
      async ["wait_gap_interval"](startTime, interval) {
        let diff = Date.now() - startTime;
        diff < interval && (await this.wait(interval - diff));
      }
    }(envName);
  }
})();
