<?php
namespace MyApp;

class Bbs {
  // 投稿を記録するファイルを作成 → ファイルパスを変数に格納
  private $dataFile = __DIR__ . '/kakikomi.dat';
  
  // 初期化メソッド
  public function __construct() {
    $this->_createToken();
  }
  
  
  // トークンの生成 (CSRF対策)
  private function _createToken() {
    if (!isset($_SESSION['token']))
      $_SESSION['token'] = bin2hex(openssl_random_pseudo_bytes(16));
  }
  
  // トークンのバリデート
  private function _validateToken($request) {
    if (
      !isset($_SESSION['token']) ||
      !isset($request['token']) ||
      $_SESSION['token'] !== $request['token']
    ) throw new \Exception('invalid token!');
  }
  
  
  // dat ファイルの投稿を1行1レスとして取得する
  public function getPosts() {
    return file($this->dataFile, FILE_IGNORE_NEW_LINES);
  }
  
  
  // 投稿の取得
  public function getPostContents($posts, $request) {
    // レス取得の初期値
    $startNum = 0;
    $endNum = null;
    
    // 投稿の場合
    if (isset($request['posted_num']))
      // POST時に取得しているレス番号
      $startNum = $request['posted_num'];
    // レスアンカーまたは範囲レスアンカーの場合
    elseif (isset($request['sendPostNumFirst']))
      // ホバーしたレスアンカーの番号
      $startNum = $request['sendPostNumFirst'] - 1;
    
    
    // レスアンカーの場合
    if(isset($request['sendPostNumLast']) && $request['sendPostNumLast'] === 0)
      $endNum = 1;
    // 範囲レスアンカーの場合
    elseif (isset($request['sendPostNumLast']))
      $endNum = $request['sendPostNumLast'] - $startNum;
    
    
    // レスを要素ごとに分割して格納するための配列
    $postsArr = [
      'postNum' => [],
      'user' => [],
      'email' => [],
      'postedAt' => [],
      'uniqueId' => [],
      'message' => []
    ];
    // 投稿を要素ごとに分割
    foreach ($posts as $i => $post) {
      $post = explode("\t", $post);
      
      $postsArr['postNum'][] = $i + 1;
      $postsArr['user'][] = $post[0];
      $postsArr['email'][] = $post[1];
      $postsArr['postedAt'][] = $post[2];
      $postsArr['uniqueId'][] = $post[3];
      $postsArr['message'][] = $post[4];
    }
    unset($post);
    
    
    // ID 重複の処理用に分割した配列の一部を複製しておく
    $postNumAll = $postsArr['postNum'];
    $uniqueIdAll = $postsArr['uniqueId'];
    
    
    // storage に値がなければ分割済みの全投稿データを返す
    if (isset($request['is_set_storage']) && !$request['is_set_storage'])
      $postsArrAll = $postsArr;
    else $postsArrAll = null;
    
    
    // 投稿時とレスアンカーへのホバー時のみ
    if (
      isset($request['sendType']) &&
      ($request['sendType'] === 'is_post' || $request['sendType'] === 'is_resAnchor')
    ) {
      // 投稿時：現在の取得済みレスから最新のレスまでを切り出す
      // レスアンカーへのホバー時：必要なレスのみを切り出す
      foreach($postsArr as $k => $v) {
        $postsArr[$k] = array_values(array_slice($v, $startNum, $endNum, true));
      }
    }
    
    // ID 重複の場合要素分割した配列は不要なので初期化しておく
    if (isset($request['sendType']) && $request['sendType'] === 'is_matchId') {
      $postsArr = [
        'postNum' => [],
        'user' => [],
        'email' => [],
        'postedAt' => [],
        'uniqueId' => [],
        'message' => []
      ];
    }
    
    return [
      $postsArr['postNum'],
      $postsArr['user'],
      $postsArr['email'],
      $postsArr['postedAt'],
      $postsArr['uniqueId'],
      $postsArr['message'],
      $postNumAll,
      $uniqueIdAll,
      $postsArrAll
    ];
  }
  
  
  public function post($request) {
    $this->_validateToken($request);
    
    // ファイルに書き込む
    try {
      if (
        !isset($request['user']) ||
        !isset($request['email']) ||
        !isset($request['message'])
      ) throw new \Exception('value not set');
      
      // POST 送信されたデータを取得する
      // 各値の前後に半角スペース・タブがあれば取り除く
      $user = trim($request['user']);
      $email = trim($request['email']);
      $message = trim($request['message']);
      
      
      // メッセージが空でないときにファイルに書き込む
      if ($message !== '') {
        // メッセージやユーザー名にタブが入力されている場合は
        // 半角スペースに置換する
        $user = str_replace("\t", ' ', $user);
        $email = str_replace("\t", ' ', $email);
        // <br> が文字として入力されている場合はエスケープ後の文字列に置換して
        // この後の、改行コードの置換と混在しないように事前に処理をしておく。
        $message = str_replace(
          [
            "\t",
            '<br>'
          ],
          [
            ' ',
            '&lt;br&gt;'
          ],
          $message
        );
        
        
        // ユーザー名が空欄なら適当な名前を付ける
        $user = ($user === '') ? '名無しさん' : $user;
        $brCode = '/\n|\r|\r\n/';
        // 改行コードを <br> に置換する
        $message = preg_replace($brCode, '', nl2br($message, false));
        
        
        $date = new \DateTimeImmutable();
        
        // 投稿した日付を入れる
        $weekArr = [
          '日',
          '月',
          '火',
          '水',
          '木',
          '金',
          '土'
        ];
        $w = $date->format('w');
        $week = $weekArr[$w];
        $postedAt = $date->format('Y/m/d') . '('. $week . ') ' . $date->format('H:i:s.v');
        
        // ミリ秒の下一桁を削除
        $postedAt = substr($postedAt, 0, -1);
        
        // ID の生成
        // 初期パラメータ
        // 投稿者のIPアドレスを取得
        $ip = $_SERVER['REMOTE_ADDR'];
        // 日付でIDが変わるように日時を取得
        $timestamp = $date->format('Y-m-d');
        // ハッシュからIPアドレスを推測させないための任意の文字列(共有の秘密キーの設定)
        $secret = '2chtekinaIDseisei';
        
        //sha1を使ってハッシュ化
        $postedId_hash = hash_hmac("sha1", $timestamp . $ip, $secret);
        //base64の形式に変換
        $postedId_base64 = base64_encode($postedId_hash);
        //先頭の8文字だけ抜き取る
        $postedId = 'ID:' . substr($postedId_base64, 0, 8);
        
        
        // メッセージ・ユーザー名・投稿時刻をタブで区切り、1投稿ごとに改行する。
        $newData = $user . "\t" . $email . "\t" . $postedAt . "\t" . $postedId ."\t". $message . "\n";
        
        // ファイルを開く
        $fp = fopen($this->dataFile, 'a');
        // ファイルに書き込む
        fwrite($fp, $newData);
        // ファイルを閉じる
        fclose($fp);
      }
    }
    catch (\Exception $e) {
    }
  }
  
  
  // エスケープされていた改行 <br> を元に戻す
  // さらに、2重にエスケープされたユーザー入力の <br> を特殊文字列に戻す
  private function replaceBr($message) {
    $escBrCode = '&lt;br&gt;';
    $escInputBr = '&amp;lt;br&amp;gt;';
    
    return $message = str_replace(
      [
        $escBrCode,
        $escInputBr
      ],
      [
        '<br>',
        '&lt;br&gt;'
      ],
      $message
    );
  }
  
  
  // エスケープ処理を済ませて渡ってきた文字列に対してアンカーをセットする
  private function replaceAnchor($message) {
    
    // レスアンカーをアンカーで囲う
    $resAnchor = [
      'base' => '/&gt;&gt;([0-9]{1,3})(-[0-9]{1,3})?/',
      'rep' => '<a class="res_anchor" href="#post$1">&gt;&gt;$1$2</a>'
    ];
    // URLをアンカーで囲う
    $urlAnchor = [
      'base' => '#(h?ttps?://[-_.!~*\'()a-zA-Z0-9;\/?:@&=+$,%\#]+)#',
      'rep' => '<a class="url_anchor" href="$1">$1</a>'
    ];
    // h 抜きのリンクに h を付ける
    $withoutH = [
      'base' => '/href="ttp/',
      'rep' => 'href="http'
    ];
    
    return preg_replace(
      [$resAnchor['base'], $urlAnchor['base'], $withoutH['base']],
      [$resAnchor['rep'], $urlAnchor['rep'], $withoutH['rep']],
      $message
    );
  }
  
  
  // メッセージを置換するメソッドをまとめて実行する
  public function setMessage($message) {
    return $this->replaceAnchor($this->replaceBr($message));
  }
  
  
  // ID が重複するインデックスを取得
  public function getMatchId($uniqueIdAll) {
    // uniqueId を元に ID 重複ごとにインデックスをまとめて格納するための配列
    $result = [];
    
    foreach($uniqueIdAll as $i => $sourceId) {
      
      // 歯抜けでデータが無ければ飛ばす
      if (!isset($uniqueIdAll[$i])) continue;
      
      // ループの外にある $result (配列)の中に格納するための配列
      $resultInner = [$i + 1];
      
      
      foreach($uniqueIdAll as $j => $targetId) {
        // 比較元と比較対象のインデックス番号が同じ場合は飛ばす
        if ($i === $j) continue;
        
        // 比較元と比較対象の値(ID)が一致した場合
        if ($sourceId === $targetId) {
          
          // レス番号を配列に追加
          $resultInner[] = $j + 1;
          
          // 比較元の値と一致した [比較対象のインデックス] を削除する
          unset($uniqueIdAll[$j]);
        }
      }
      // foreach の最後の値を削除
      unset($targetId);
      
      // [比較元として使用したインデックスと値] を削除する
      unset($uniqueIdAll[$i]);
      
      // IDの重複があった場合ループの外の配列に追加する
      $result[] = [
        'id' => $sourceId,
        'resNum' => $resultInner
      ];
    }
    unset($sourceId);
    return $result;
  }
  
  
  
  // ID の重複の要素を置換
  public function setUniqueId($uniqueId, $postNum, $matchIdArr) {
    
    // 複数の ID 重複を格納した配列をループさせる
    foreach($matchIdArr as $inner) {
      // $matchIdArr の中の配列の値(ID)と呼び出し時の引数の
      // IDが一致した場合
      if ($inner['id'] === $uniqueId) {
        
        foreach($inner['resNum'] as $i => $resNum) {
          if ($resNum === $postNum) {
            // $i は foreach の外に出せないので変数に代入
            $num = $i;
            break 1;
          }
        }
        unset($resNum);
        
        // ID 重複の総数
        $count = count($inner['resNum']);
        // ID のパターン
        $pattern = '/(ID)(:[-_.!~*\'()a-zA-Z0-9;\/?:@&=+$,%\#]{8})/';
        
        // ID 重複がない場合
        if ($count === 1)
          $replace = '<a class="match_id is-inactive">$1</a><span>$2</span><span class="match_id_num is-disabled"> [' . ($num + 1) . '/' . $count . ']</span>';
        // ID 重複がある場合
        else
          $replace = '<a class="match_id">$1</a><span>$2</span><span class="match_id_num"> [' . ($num + 1) . '/' . $count . ']</span>';
        
        return preg_replace($pattern, $replace, $uniqueId);
      }
    }
    unset($inner);
  }
}


