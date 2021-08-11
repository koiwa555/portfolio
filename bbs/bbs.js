var setBbsFunc = function() {
  'use strict';
  
  // userAgent でスマホ・タブレットの判定
  var isSmartPhoneOrTablet = (function() {
    if (!navigator.userAgent.match(/iPhone|iPad|Android/)) return;
    return true;
  }());
  
  
  
  // 空配列を除外するメソッド
  var removeEmptyArr = function(arr) {
    return arr.filter(function(v){
      return !(v === null || v === undefined || v === '');
    });
  }
  
  
  
  // 要素を生成する
  var createElem = function(obj) {
    var result = document.createElement(obj.tagName),
        text;
    
    if (obj.attr) {
      // 属性が存在する場合
      Object.keys(obj.attr).forEach(function(prop) {
        result.setAttribute(prop, obj.attr[prop]);
      });
    }
    if (obj.text) {
      text = document.createTextNode(obj.text);
      result.appendChild(text);
    }
    return result;
  };
  
  
  
  // sage チェックボックスをクリックすとメール欄に sage が入る
  $('#sage').on('click', function() {
    if ($('#sage').prop('checked')) {
      $('#email').val('sage');
      $('#email').prop('readonly', true);
      return;
    }
    $('#email').val('');
    $('#email').prop('readonly', false);
  });
  
  
  // ID 重複の母数と子数を取得する
  var getMatchIdCount = function(res) {
    var matchIdArr,
        // 一致した ID リスト
        idList = [],
        // 母数
        idCount = [],
        // 子数
        idNum = [];
    
    // POST 送信で受け取った res と疑似的に作成した pseudoRes での振り分け
    // pseudoRes に matchIdArr はないので、sessionStorage から取得する
    matchIdArr = res.matchIdArr ? res.matchIdArr : JSON.parse(sessionStorage.getItem('matchIdArr'));
    
    // 取得した res の ID を軸としてループ
    res.uniqueId.forEach(function(v, i) {
      matchIdArr.forEach(function(w, j) {
        // 値が取得できていればリターン
        if (idCount[i]) return;
        // ID が一致しない場合
        if (res.uniqueId[i] !== matchIdArr[j].id) return;
        
        // ID が一致した場合
        idList.push(matchIdArr[j].resNum);
        idCount.push(matchIdArr[j].resNum.length);
        
        // ID 重複のレス番号でループ
        matchIdArr[j].resNum.forEach(function(x, k) {
          
          // 値が取得できていればリターン
          if (idNum[i]) return;
          // レス番号が一致しない場合
          if (matchIdArr[j].resNum[k] !== res.postNum[i]) return;
          
          // レス番号が一致した場合
          idNum.push(k + 1);
        });
      });
    });
    
    // 引数のオブジェクト res に取得した値を追加して返す
    res.idList = idList;
    res.idCount = idCount;
    res.idNum = idNum;
    return res;
  };
  
  
  
  var setUniqueId = function(res, i, type) {
    var id = {
          tagName: 'span',
          text: res.uniqueId[i].substr(2)
        },
        uniqueId,
        matchId,
        matchIdNum;
    
    // 投稿の場合 または レスアンカーにホバーした場合
    if (type === 'is_post' || type === 'is_resAnchor') {
      uniqueId = {
        tagName: 'span',
        attr: {
          class: 'post_unique_id'
        }
      };
      matchId = {
        tagName: 'a',
        attr: {
          // [1/1] の場合はクラスを付与してアンカーを殺す
          class: res.idCount[i] === 1 ? 'match_id is-inactive' : 'match_id'
        },
        text: 'ID'
      };
      matchIdNum = {
        tagName: 'span',
        attr: {
          class: 'match_id_num'
        },
        text: '[' + res.idNum[i] + '/' + res.idCount[i] + ']'
      };
    }
    // ID 重複の ID にホバーした場合
    else if (type === 'is_matchId') {
      uniqueId = {
        tagName: 'span',
        attr: {
          class: 'post_unique_id is-match_id'
        },
        text: 'ID'
      };
      matchIdNum = {
        tagName: 'span',
        attr: {
          class: 'match_id_num'
        },
        text: '[' + (i + 1) + '/' + res.postNum.length + ']'
      };
    }
    
    uniqueId = createElem(uniqueId);
    if (matchId) {
      matchId = createElem(matchId);
      uniqueId.appendChild(matchId);
    }
    id = createElem(id);
    matchIdNum = createElem(matchIdNum);
    
    // ID 重複が無い場合([1/1])
    // [1/1] の表記を非表示にするクラス名を付与する
    if (matchIdNum.textContent == "[1/1]")
      matchIdNum.setAttribute('class', 'match_id_num is-disabled');
    
    uniqueId.appendChild(id);
    uniqueId.appendChild(matchIdNum);
    
    return uniqueId;
  };
  
  
  
  // message をレスアンカーやURLで分割する
  var splitMessage = function(res, i, pattern) {
    // 分割した message を格納する配列
    // 右辺にて予め message を配列に入れておき、常に配列として扱うことにする。
    var messageInnerArr = [res.message[i]];
    
    // パターンの数だけループ
    Object.keys(pattern).forEach(function(key) {
          // パターンで分割された配列を一次元でまとめるための配列
      var result = [],
          // パターンで分割された配列を格納する
          tmpArr;
      
      // 分割されたメッセージの分だけループ
      messageInnerArr.forEach(function(v) {
        tmpArr = v.split(pattern[key]);
        
        // 分割された配列を全て result に追加する
        tmpArr.forEach(function(v) {
          result.push(v);
        });
      });
      
      // 常に一次元の配列に対してパターンで分割し、ループを行っていく。
      messageInnerArr = result;
    });
    
    return messageInnerArr;
  };
  
  
  
  var getMatchMessageIndex = function(messageInnerArr, pattern) {
    // パターンにマッチするインデックス一覧を格納したオブジェクト
    var result = {};
    
    Object.keys(pattern).forEach(function(v) {
      var tmpArr = [];
      
      // メッセージの配列でループを回す
      messageInnerArr.forEach(function(w) {
        // 正規表現を利用するたびに、一致時に保持される lastIndex (文字数)を初期化する。
        pattern[v].lastIndex = 0;
        
        // パターン一致の成否を返す
        tmpArr.push(pattern[v].test(w));
      });
      // 大本のオブジェクトに追加する
      result[v] = tmpArr;
    });
    return result;
  };
  
  
  
  var createMessageResAnchor = function(message, v) {
    // レスアンカーに該当する文字列で分割して数値を取得する
    var num = v.split(/&gt;&gt;|-/),
        resAnchor;
    
    num = removeEmptyArr(num);
    
    // [>>] を Unicode エスケープする
    v = v.replace(/&gt;/g, '\u003e');
    
    resAnchor = {
      tagName: 'a',
      attr: {
        class: 'res_anchor',
        href: '#post' + num[0]
      },
      text: v
    };
    resAnchor = createElem(resAnchor);
    
    message.appendChild(resAnchor);
  };
  
  
  
  var createMessageUrlAnchor = function(message, v) {
    // href 属性の値に対して h 抜きリンクの対処
    var hrefValue = v.slice(0, 1) === 'h' ? v : 'h' + v,
        urlAnchor = {
          tagName: 'a',
          attr: {
            class: 'url_anchor',
            href: hrefValue
          },
          text: v
        };
    
    urlAnchor = createElem(urlAnchor);
    
    message.appendChild(urlAnchor);
  };
  
  
  
  // br 要素を生成するだけなので引数の [v] は不要！
  var createMessageBr = function(message) {
    var br = document.createElement('br');
    message.appendChild(br);
  };
  
  
  
  // createTextNode() でエスケープされる文字列を Unicode エスケープする
  // これらの文字は PHP の htmlspecialchars() でエスケープされた文字
  // その他の記号は特にこっちで置換する必要は無さそう。
  var unicodeEscape = function(v) {
    return v.replace(/&amp;/g, '\u0026') // [&]
            .replace(/&#039;/g, '\u0027') // [']
            .replace(/&quot;/g, '\u0022') // ["]
            // .replace(/&#x60;/g, '\u0022') // [`] 不要
            .replace(/&lt;/g, '\u003c') // [<]
            .replace(/&gt;/g, '\u003e'); // [>]
  };
  
  
  
  // メッセージの生成
  var createMessageElem = function(messageInnerArr, matchIndex, message) {
    var create = {
      resAnchor: createMessageResAnchor,
      urlAnchor: createMessageUrlAnchor,
      br: createMessageBr
    };
    
    // messageInnerArr こと message の内容が分割された配列をループさせつつ、
    // matchIndex ことレスアンカーや URL リンクに該当したインデックスが格納された
    // オブジェクトを回して、一致した箇所で要素を生成していく。
    messageInnerArr.forEach(function(v, i) {
      // [文字列] か [レスアンカー・URLアンカー・br] の内のいずれかの判定フラグ
      var isMatchReplaceProperty,
          str;
      
      // レスアンカー・URLアンカー・br ごとにループを回す
      Object.keys(matchIndex).forEach(function(key) {
        
        // 文字列の場合
        // 値が false なら返す
        if (!matchIndex[key][i]) return;
        
        // レスアンカー・URLアンカー・br いずれかの場合
        isMatchReplaceProperty = true;
        
        // URL アンカーのときだけ Unicode エスケープ
        if (key === 'urlAnchor') v = unicodeEscape(v);
        
        // [key] としてレスアンカー・URLアンカー・br いずれかに対応した
        // メソッドを呼び出しつつ、(message, v) として要素と生成対象の文字列を
        // 実引数として渡す。
        create[key](message, v);
      });
      
      // レスアンカー・URLアンカー・br いずれかであれば返す
      // 一致しなければただの文字列となる
      if (isMatchReplaceProperty) return;
      
      // 文字列の場合も Unicode エスケープ
      str = document.createTextNode(unicodeEscape(v));
      message.appendChild(str);
    });
    return message;
  };
  
  
  
  // message の処理まとめ
  var setMessage = function(res, i) {
    var message = {
          tagName: 'div',
          attr: {
            class: 'post_message'
          },
        },
        pattern = {
          // レスアンカーまたは範囲レスアンカー
          resAnchor : /(&gt;&gt;[0-9]{1,3}(?:-[0-9]{1,3})?)/g,
          urlAnchor : new RegExp('(h?ttps?://[-_.!~*\'()a-zA-Z0-9;\/?:@&=+$,%\#]+)', 'g'),
          br :  /(&lt;br&gt;)/g
        },
        messageInnerArr = splitMessage(res, i, pattern),
        // 空配列を削除
        messageInnerArr = removeEmptyArr(messageInnerArr),
        matchIndex = getMatchMessageIndex(messageInnerArr, pattern);
    
    message = createElem(message);
    
    return createMessageElem(messageInnerArr, matchIndex, message);
  };
  
  
  
  // リスト要素の生成
  var createList = function (e, res, type) {
    var target = e.currentTarget,
        olSetPosition = target,
        duplicateElem1,
        duplicateElem2,
        olWrap,
        ol,
        hoverOverlay,
        futureListInnerWrap;
    
    
    // 投稿の場合
    if (target.getAttribute('id') === 'submit')
      // ol こと追加対象をベースの ol とする
      ol = document.getElementById('postList');
    // レスアンカーの場合
    else {
      while (olSetPosition.tagName !== 'LI' && olSetPosition.tagName !== 'BODY') {
        olSetPosition = olSetPosition.parentNode;
      }
      
      // 重複生成されてしまった要素があれば削除する
      duplicateElem1 = olSetPosition.getElementsByClassName('hover_posts_list_wrap');
      duplicateElem2 = olSetPosition.getElementsByClassName('hover_overlay');
      if (duplicateElem1[0]) {
        duplicateElem1[0].parentNode.removeChild(duplicateElem1[0]);
        duplicateElem2[0].parentNode.removeChild(duplicateElem2[0])
      }
      
      olWrap = {
        tagName: 'div',
        attr: {
          class: 'hover_posts_list_wrap',
        }
      };
      ol = {
        tagName: 'ol',
        attr: {
          class: 'hover_posts_list',
        }
      };
      hoverOverlay = {
        tagName: 'div',
        attr: {
          class: 'hover_overlay',
        }
      };
      olWrap = createElem(olWrap);
      ol = createElem(ol);
      hoverOverlay = createElem(hoverOverlay);
      
      olSetPosition.appendChild(olWrap);
      olWrap.appendChild(ol);
      olSetPosition.appendChild(hoverOverlay);
      
      // 未来レスアンカーの場合
      // res にあたる仮引数に null が渡っているのでそこで判定する
      if (!res) {
        futureListInnerWrap = {
          tagName: 'div',
          attr: {
            class: 'post_inner_wrap is-future',
          },
          text: 'このレス番号はまだ存在しません'
        };
        futureListInnerWrap = createElem(futureListInnerWrap);
        
        ol.appendChild(futureListInnerWrap);
        
        // 以降の処理は不要なので返す
        return;
      }
    }
    
    
    Object.keys(res.postNum).forEach(function(v, i) {
      var li = {
            tagName: 'li',
            attr: {
              id: 'post' + res.postNum[i],
            }
          },
          postInnerWrap = {
            tagName: 'div',
            attr: {
              class: 'post_inner_wrap',
            }
          },
          postedAt = {
            tagName: 'span',
            attr: {
              class: 'post_date'
            },
            text: res.postedAt[i]
          },
          postNum,
          email,
          uniqueId,
          message;
      
      // 投稿時とホップアップとで処理を振り分ける
      // ホップアップではレス番号にアンカーを埋め込む
      if (type === 'is_post') {
        postNum = {
          tagName: 'span',
          attr: {
            class: 'post_num',
          },
          text: res.postNum[i]
        };
      }
      else if (type === 'is_resAnchor' || type === 'is_matchId') {
        postNum = {
          tagName: 'a',
          attr: {
            class: 'post_num',
            href: '#post' + res.postNum[i],
          },
          text: res.postNum[i]
        };
      }
      
      if (res.email[i]) {
        email = {
          tagName: 'a',
          attr: {
            class: 'post_user',
            href: 'mailto:' + res.email[i],
          },
          text: res.user[i]
        };
      }
      else {
        email = {
          tagName: 'span',
          attr: {
            class: 'post_user'
          },
          text: res.user[i]
        };
      }
      
      li = createElem(li);
      postInnerWrap = createElem(postInnerWrap);
      postNum = createElem(postNum);
      email = createElem(email);
      postedAt = createElem(postedAt);
      
      // IDの生成
      uniqueId = setUniqueId(res, i, type);
      
      // メッセージの生成
      message = setMessage(res, i);
      
      ol.appendChild(li);
      li.appendChild(postInnerWrap);
      postInnerWrap.appendChild(postNum);
      postInnerWrap.appendChild(email);
      postInnerWrap.appendChild(postedAt);
      postInnerWrap.appendChild(uniqueId);
      postInnerWrap.appendChild(message);
    });
  };
  
  
  
  // POST 送信側で取得した数値が文字列になっているので数値に戻す
  var strToNum = function(res) {
    var func = function(arr) {
      return arr.map(Number);
    };
    
    // postsArrAll がある場合
    if (res.postsArrAll)
      // 返り値の 1 つの投稿番号を文字列から数値に変換
      res.postsArrAll.postNum = func(res.postsArrAll.postNum);
    
    res.matchIdArr.forEach(function(v) {
      v.resNum = func(v.resNum);
    });
    
    res.postNum = func(res.postNum);
    
    return res;
  };
  
  
  
  var updateStorage = function(res) {
    // matchIdArr は常にまるごと上書き
    sessionStorage.setItem('matchIdArr', JSON.stringify(res.matchIdArr));
    
    // 初回の POST 送信の場合 ※初回の投稿またはホバーのこと (storage に値がない場合)
    if (res.postsArrAll) {
      sessionStorage.setItem('postsArr', JSON.stringify(res.postsArrAll));
      return;
    }
    
    // 初回以降の POST 送信の場合 (storage に値がある場合)
    var postsArr = JSON.parse(sessionStorage.getItem('postsArr'));
    
    // それぞれのプロパティの配列に結合する
    Object.keys(postsArr).forEach(function(key) {
      Array.prototype.push.apply(postsArr[key], res[key]);
    });
    
    // 再度保持する
    sessionStorage.setItem('postsArr', JSON.stringify(postsArr));
  };
  
  
  
  var changeMatchIdCount = function(res) {
    var target,
        targetStr,
        pattern;
    
    res.idList.forEach(function(v, i) {
      res.idList[i].forEach(function(w) {
        // ID 重複リストから対象要素を取得
        target = document.querySelector('#post' + w + ' .match_id_num');
        // 対象要素のテキストを取得
        targetStr = target.textContent;
        
        // 置換用パターン
        pattern =  /(\/[0-9]{1,3})/;
        targetStr = targetStr.replace(pattern, '/' + res.idCount[i]);
        
        target.textContent = targetStr
        
        // [1/1] から [1/2] になったときにリンクや文字が非表示になっているのでその対処
        if (target.textContent !== '[1/2]' || !target.classList.contains('is-disabled'))
          return;
        
        target.classList.remove('is-disabled');
        target.previousElementSibling.previousElementSibling.classList.remove('is-inactive');
      });
    });
    
  };
  
  
  
  var clickSubmitEvent = function(e) {
    var data,
        type = 'is_post',
        postData = {},
        // storage のデータを格納する変数
        postsArr;
    
    if ($('#message').val() === '') {
      alert('メッセージが空です');
      return false;
    }
    
    // 投稿ボタンの無効化
    $('#submit').attr('disabled', true);
    
    // フォーム要素を一括で JSON 形式にする場合
    data = $('form').serializeArray();
    
    // serializeArray() を掛けて取得した配列に対して forEach を
    // 使ってキー名に [name] の値、値名に [value] の値を代入
    data.forEach(function (v) {
      var key = v.name,
          value = v.value;
      
      // 事前に用意した空オブジェクトに追加していく
      postData[key] = value;
    });
    
    postData.sendType = 'is_post';
    
    // storage に既に値が存在するかチェック
    postsArr = JSON.parse(sessionStorage.getItem('postsArr'));
    postData.is_set_storage = postsArr ? true : false;
    
    $.ajax({
      url: '_ajax.php',
      type: 'POST',
      // 送信するデータの型
      dataType: 'json',
      // レスポンスの期待するデータの型
      // 文字列の括りの中に2つの値が入っている点に注意！
      contentType: 'application/json; charset=utf-8',
      // 送信するデータ
      data: JSON.stringify(postData),
      // リクエストのタイムアウト(ミリ秒)
      timeout: 5000
    })
    .done(function(res) {
      res = strToNum(res);
      
      updateStorage(res);
      res = getMatchIdCount(res);
      createList(e, res, type);
      
      // 受け取った投稿内容から ID 重複を探して母数と子数を変更する
      changeMatchIdCount(res);
      
      // フォームの入力を削除する
      $('#user').val('');
      if (!$('#sage').prop('checked')) $('#email').val('');
      $('#message').val('');
      
      // #postNum の値を投稿時に取得した最新のレス番号で値を上書きする
      $('#postNum').val(res.postNum[res.postNum.length - 1]);
      
      // 投稿ボタンの有効化
      $('#submit').attr('disabled', false);
      
      if (!isSmartPhoneOrTablet) return;
      
      // スマホ・タブレット用のサイドナビの Latest の href を最新のレス番号に書き換える
      $('#sideNavLatest').attr('href', '#post' + res.postNum[res.postNum.length - 1]);
    });
    return false;
  };
  $('#submit').on('click', clickSubmitEvent);
  
  
  
  // レスアンカーに hover したときの処理
  var mouseEnterResAnchorEvent = function(e) {
    var target = e.currentTarget,
        baseList,
        baseOrderList,
        sendPostNumArr = [],
        sendPostNum = e.currentTarget.textContent,
        listLength = document.getElementById('postList').children.length,
        postData = {},
        postsArr,
        // ストレージの値と POST 送信用の値とで疑似的に
        // ajax の res と同じ内容のデータを作る
        pseudoRes = {},
        startNum,
        endNum;
    
    while (!target.classList.contains('post_inner_wrap') && target.tagName !== 'BODY') {
      target = target.parentNode;
    }
    baseList = target.parentNode;
    
    while (baseList.tagName !== 'LI' && baseList.tagName !== 'BODY') {
      baseList = baseList.parentNode;
    }
    baseOrderList = baseList.parentNode;
    
    target.classList.add('is-hovered');
    baseList.classList.add('is-hovered');
    baseOrderList.classList.add('is-hovered');
    
    // 文字列を分割
    sendPostNum = sendPostNum.split(/>>|-/);
    // 空配列を削除
    sendPostNumArr = removeEmptyArr(sendPostNum);
    
    // 文字列の数値化
    sendPostNumArr[0] = Number(sendPostNumArr[0]);
    
    // レスアンカーの場合と範囲レスアンカーの場合の振り分け
    sendPostNumArr[1] = sendPostNumArr[1] ? Number(sendPostNumArr[1]) : 0;
    
    // POST 送信するデータ
    postData.sendPostNumFirst = sendPostNumArr[0];
    postData.sendPostNumLast = sendPostNumArr[1];
    postData.sendType = 'is_resAnchor';
    
    // 0番へのレスアンカー または 未来レスアンカーの場合
    if (sendPostNumArr[0] === 0 || sendPostNumArr[0] > listLength) {
      createList(e, null, postData.sendType);
      return;
    }
    
    postsArr = JSON.parse(sessionStorage.getItem('postsArr'));
    
    // storage に値がセットされているか判定
    postData.is_set_storage = postsArr ? true : false;
    
    // storage に値がある場合は storage の値でリスト生成
    if (postData.is_set_storage) {
      startNum = postData.sendPostNumFirst - 1;
      endNum = postData.sendPostNumLast ? postData.sendPostNumLast - 1 : startNum ;
      
      // storage のデータから必要な要素を取得する
      Object.keys(postsArr).forEach(function(v) {
        // for 文ようの index (forEach 側とは関係ない)
        var i;
        
        // postsArr の各要素を切り出すための空配列
        pseudoRes[v] = [];
        
        for (i = startNum; i <= endNum; i++) {
          pseudoRes[v].push(postsArr[v][i]);
        }
      });
      
      pseudoRes = getMatchIdCount(pseudoRes);
      createList(e, pseudoRes, postData.sendType);
      return;
    } // end if
    
    // storage に値がない場合は POST 送信で各要素を取得してからリスト生成
    $.ajax({
      url: '_ajax.php',
      type: 'POST',
      dataType: 'json',
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify(postData),
      timeout: 5000
    })
    .done(function(res) {
      res = strToNum(res);
      updateStorage(res);
      res = getMatchIdCount(res);
      createList(e, res, postData.sendType);
    });
    return false;
  };
  $(document).on({'mouseenter': mouseEnterResAnchorEvent}, '.res_anchor');
  
  
  
  // ID 重複のレス取得
  var getMatchIdContent = function(e) {
    var postsArr = JSON.parse(sessionStorage.getItem('postsArr')),
        matchIdArr = JSON.parse(sessionStorage.getItem('matchIdArr')),
        // 対象の ID を取得
        targetId = 'ID' + e.currentTarget.nextElementSibling.textContent,
        sendPostNumArr = [],
        pseudoRes = {};
    
    // ID 重複のレス番号を取得
    matchIdArr.forEach(function(v, i) {
      // 配列に値がセットされていれば返す
      if (sendPostNumArr.length !== 0) return;
      if (v.id == targetId) sendPostNumArr = v.resNum;
    });
    
    // ID 一致のレス番号を [-1] してインデックス番号にする
    sendPostNumArr = sendPostNumArr.map(function(v) {
      return v - 1;
    })
    
    // 投稿一覧から ID 重複のレス全て抽出する
    Object.keys(postsArr).forEach(function(key) {
      pseudoRes[key] = [];
      
      // ID 重複のインデックス番号リストでループを回してレスを取得
      sendPostNumArr.forEach(function(v){
        pseudoRes[key].push(postsArr[key][v]);
      });
    });
    return pseudoRes;
  };
  
  
  
  // ID 重複したときの処理
  var mouseEnterMatchIdEvent = function(e) {
    var target = e.currentTarget,
          baseList,
          baseOrderList,
          postData = {},
          postsArr,
          pseudoRes;
      
      while (!target.classList.contains('post_inner_wrap') && target.tagName !== 'BODY') {
        target = target.parentNode;
      }
      
      baseList = target.parentNode;
      while (baseList.tagName !== 'LI' && baseList.tagName !== 'BODY') {
        baseList = baseList.parentNode;
      }
      baseOrderList = baseList.parentNode;
      
      target.classList.add('is-hovered');
      baseList.classList.add('is-hovered');
      baseOrderList.classList.add('is-hovered');
      
      postData.sendType = 'is_matchId';
      
      postsArr = JSON.parse(sessionStorage.getItem('postsArr'));
      postData.is_set_storage = postsArr ? true : false;
      
      if (postData.is_set_storage) {
        pseudoRes = getMatchIdContent(e);
        createList(e, pseudoRes, postData.sendType);
        return;
      }
      
      $.ajax({
        url: '_ajax.php',
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(postData),
        timeout: 5000
      })
      .done(function(res) {
        res = strToNum(res);
        updateStorage(res);
        pseudoRes = getMatchIdContent(e);
        createList(e, pseudoRes, postData.sendType);
      });
      return false;
  };
  $(document).on({'mouseenter': mouseEnterMatchIdEvent}, '.match_id');
  
  
  
  var mouseEnterHoverOverlayEvent = function(e, target) {
    var target = target ? target : e.currentTarget,
        hoverPostsListWrap = target.previousElementSibling,
        postInnerWrap = hoverPostsListWrap.previousElementSibling,
        baseList,
        baseOrderList;
    
    baseList = target.parentNode;
    while (baseList.tagName !== 'LI' && baseList.tagName !== 'BODY') {
      baseList = baseList.parentNode;
    }
    baseOrderList = baseList.parentNode;
    
    postInnerWrap.classList.remove('is-hovered');
    baseList.classList.remove('is-hovered');
    baseOrderList.classList.remove('is-hovered');
    
    
    hoverPostsListWrap.parentNode.removeChild(hoverPostsListWrap);
    target.parentNode.removeChild(target);
  };
  $(document).on({'mouseenter': mouseEnterHoverOverlayEvent}, '.hover_overlay');
  
  
  
  var sideNavListClickEvent = function() {
    var target = document.getElementById('sideNavBtn');
    target.classList.remove('is-showed');
  };
  
  
  
  var setSideNavListClickEvent = function() {
    var sideNavList = document.getElementsByClassName('side_nav_list_item');
    Object.keys(sideNavList).forEach(function(v) {
      sideNavList[v].addEventListener('click', sideNavListClickEvent);
    });
  };
  
  
  
  // サイドナビを下端までスクロールさせて Latest が表示された状態にしておく
  var setSideNavListScroll = function() {
    var target = document.getElementById('sideNavListWrap');
    target.scrollTop = 1000;
  };
  
  
  
  // 100レス単位で有効なサイドナビを判定し表示できる状態にする
  var checkValidSideNav = function() {
    var length = String(document.getElementById('postList').children.length),
        latestAnchor = document.getElementById('sideNavLatest'),
        firstOneDigits,
        sideNavList = document.getElementsByClassName('side_nav_list_item');
    
    latestAnchor.setAttribute('href', '#post' + length);
    
    // 3桁以下なら返す
    if (length.length < 3) return;
    
    firstOneDigits = Number(length.slice(0, 1));
    
    // 0 番はループに含めずに飛ばす
    for (var i = 1; i <= firstOneDigits; i++) {
      if (i === 10) return;
      sideNavList[i].classList.remove('is-hide');
    }
  };
  
  
  // --------------------------------------------------------------------------------
  
  
  var sideNavToggleBtnEvent = function() {
    var target = document.getElementById('sideNavBtn');
    
    if(!target.classList.contains('is-showed')) target.classList.add('is-showed');
    else target.classList.remove('is-showed');
  };
  
  
  
  var clickSideNavToggleBtn = function() {
    var arr = [
      document.getElementById('sideNavToggleBtn'),
      document.getElementById('sideNavOverlay')
    ];
    
    // NAV表示切替ボタンをアクティブ(表示)にする
    arr[0].classList.add('is-active');
    
    arr.forEach(function(v) {
      v.addEventListener('click',sideNavToggleBtnEvent);
    });
  };
  
  
  
  // [post_num] をクリックした際にスクロールしつつホップアップを消す
  var setPostNumClickEvent = function() {
    var hoverOverlay = document.getElementsByClassName('hover_overlay'),
        length = hoverOverlay.length - 1;
    
    // ホップアップではない通常のレスでの未来アンカーを2回連続でクリックした際の
    // エラー対処として、[hover_overlay] 要素を取得できなければ返してしまう。
    if(!hoverOverlay[0]) return;
    
    // 最後の [hover_overlay] を引数としてメソッドを呼び出す
    mouseEnterHoverOverlayEvent(null, hoverOverlay[length]);
  };
  
  
  // --------------------------------------------------------------------------------
  
  
  // スマホ用のスライドボタンのイベント
  var formSlideBtnEvent = function(e) {
    e.currentTarget.parentNode.classList.toggle('is-slid');
    document.body.classList.toggle('is-slid');
    document.getElementById('sideNavBtn').classList.remove('is-showed');
  };
  
  
  
  // タブ・SP幅でイベントを設置
  var setFormSlideBtnEvent = function(w) {
    var btn = document.getElementById('formSlideBtn');
    
    btn.removeEventListener('click', formSlideBtnEvent);
    if (w > 767) return;
    btn.addEventListener('click', formSlideBtnEvent);
  };
  
  
  
  // スマホのときに res_anchor クリック時のスムーススクロールイベント発火の中止(動的要素版)
  var interruptResAnchorClickEvent = function(e) {
    // a 要素の動作を停止する
    e.preventDefault();
    // 後からバインドされたイベントの発火を停止しつつさらにバブリングも停止する。
    e.stopImmediatePropagation();
  };
  
  
  
  // デスクトップ幅での動的要素イベント
  var overPcWidthDynamicEvent = function(e) {
    var target = e.target;
    
    if (
      !target.classList.contains('post_num') &&
      !target.classList.contains('res_anchor')
    ) return;
    
    setPostNumClickEvent(target);
  };
  
  
  
  var underTabletWidthDynamicEvent = function(e) {
    var target = e.target;
    
    // SP タブ幅の場合
    if (target.classList.contains('post_num')) setPostNumClickEvent(target);
    
    // デバイスがタブ・スマホでなければ返す
    if (!isSmartPhoneOrTablet) return;
    if (target.classList.contains('res_anchor')) interruptResAnchorClickEvent(e);
  };
  
  
  
  var setDynamicEvent = function(w) {
    // リサイズ時用に一律でイベントを外す
    document.removeEventListener('click', overPcWidthDynamicEvent, {capture: true});
    document.removeEventListener('click', underTabletWidthDynamicEvent, {capture: true});
    // PC幅の場合
    if (w > 767) {
      document.addEventListener('click', overPcWidthDynamicEvent, {capture: true});
      return;
    }
    // タブ・スマホ幅の場合
    document.addEventListener('click', underTabletWidthDynamicEvent, {capture: true});
  };
  
  
  
  var resizeCallSummary = function() {
    var WINDOW_WIDTH = window.innerWidth;
    setFormSlideBtnEvent(WINDOW_WIDTH);
    setDynamicEvent(WINDOW_WIDTH);
  };
  
  
  
  var thinOutResizingEvent = function() {
    clearTimeout(this.timeoutId);
    this.timeoutId = setTimeout(resizeCallSummary, 500);
  };
  
  
  
  var setThinOutResizingEvent = function() {
    var handleObj = {
      timeoutId: null,
      handleEvent: thinOutResizingEvent
    };
    window.addEventListener('resize', handleObj);
  };
  
  
  
  var asideEventCallSummary = function() {
    var WINDOW_WIDTH = window.innerWidth;
    
    setFormSlideBtnEvent(WINDOW_WIDTH);
    setDynamicEvent(WINDOW_WIDTH);
    
    if (isSmartPhoneOrTablet) clickSideNavToggleBtn();
    
    checkValidSideNav();
    setSideNavListScroll();
    setSideNavListClickEvent();
    
    setThinOutResizingEvent();
  };
  asideEventCallSummary();
};
window.addEventListener('load', setBbsFunc);

