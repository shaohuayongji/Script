# Third-party notices

此目录的标准密码库从 npm 官方 registry 的固定版本发布包提取，原始库文件未修改；主脚本可以将其捆绑为单文件，并保留下列版权许可声明。未执行亚朵官方前端 bundle。

## sm-crypto 0.3.13

- Repository: [sm-crypto](https://github.com/JuneAndGreen/sm-crypto)
- Source package: [sm-crypto-0.3.13.tgz](https://registry.npmjs.org/sm-crypto/-/sm-crypto-0.3.13.tgz)
- File: `vendor/sm-crypto-sm2-0.3.13.js` (unmodified `package/dist/sm2.js`)
- File SHA-256: `320dc9bed7f6a6be32c690f893f87c9c1e5dfd7d56e44dbec056080b3cf7a08d`
- Package SHA-256: `6b9093bae5ff0305cb312c8ce9d25bad31618bec2edfdad26eb67a1b4e163730`
- License copy: `vendor/sm-crypto-0.3.13-LICENSE.txt`

```text
Copyright © 2018 june01

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```

## crypto-js 4.2.0

- Repository: [crypto-js](https://github.com/brix/crypto-js)
- Source package: [crypto-js-4.2.0.tgz](https://registry.npmjs.org/crypto-js/-/crypto-js-4.2.0.tgz)
- File: `vendor/crypto-js-4.2.0.js` (unmodified `package/crypto-js.js`)
- File SHA-256: `ee02257ffbaf0a9b481c7039b0f3bb20c360c9674fe4be8b38ae709b2ea59bbe`
- Package SHA-256: `2d288a658b3eae000d7fadfdfdf5fe2bec3952cb19212360db8c7686c2b6ce09`
- License copy: `vendor/crypto-js-4.2.0-LICENSE.txt`

```text
# License

[The MIT License (MIT)](http://opensource.org/licenses/MIT)

Copyright (c) 2009-2013 Jeff Mott  
Copyright (c) 2013-2016 Evan Vosberg

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```

## jsbn 1.1.0

- Repository: [jsbn](https://github.com/andyperlitch/jsbn)
- Source package: [jsbn-1.1.0.tgz](https://registry.npmjs.org/jsbn/-/jsbn-1.1.0.tgz)
- Included as the SM2 bundle's jsbn large-integer dependency; the retained license is from the declared `^1.1.0` dependency series.
- Package SHA-256: `47cafa971709bb193242ef857fb25936ecd9522a1d44a01ce4858723a006ac45`
- License copy: `vendor/jsbn-1.1.0-LICENSE.txt`

```text
Licensing
---------

This software is covered under the following copyright:

/*
 * Copyright (c) 2003-2005  Tom Wu
 * All Rights Reserved.
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS-IS" AND WITHOUT WARRANTY OF ANY KIND, 
 * EXPRESS, IMPLIED OR OTHERWISE, INCLUDING WITHOUT LIMITATION, ANY 
 * WARRANTY OF MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE.  
 *
 * IN NO EVENT SHALL TOM WU BE LIABLE FOR ANY SPECIAL, INCIDENTAL,
 * INDIRECT OR CONSEQUENTIAL DAMAGES OF ANY KIND, OR ANY DAMAGES WHATSOEVER
 * RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER OR NOT ADVISED OF
 * THE POSSIBILITY OF DAMAGE, AND ON ANY THEORY OF LIABILITY, ARISING OUT
 * OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 *
 * In addition, the following condition applies:
 *
 * All redistributions must retain an intact copy of this copyright notice
 * and disclaimer.
 */

Address all questions regarding this license to:

  Tom Wu
  tjw@cs.Stanford.EDU
```

## Runtime verification

On 2026-10-04, both UMD bundles loaded in a Node 24 VM with `window`, `navigator`, `require`, and `module` all absent. They exposed `sm2` and `CryptoJS` globals. An AES-256-CBC/PKCS7 synthetic ciphertext generated with Node native crypto decrypted correctly; a synthetic SM2 C1C2C3 ciphertext decrypted correctly; changing C3 caused SM2 decryption to return an empty result. These checks concern local standard library behavior and do not verify the user's iPhone, credentials, or the remote sign-in service.

The Loon script only needs deterministic decryption. It does not use these bundles to create account keys or generate production ciphertext. The SM2 bundle has a legacy random fallback; do not use that fallback for production key generation. CryptoJS decryption with an explicit key and IV does not require a random-number source.
