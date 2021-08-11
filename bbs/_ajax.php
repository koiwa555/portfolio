<?php
require_once(__DIR__ . '/config.php');
require_once(__DIR__ . '/functions.php');
require_once(__DIR__ . '/bbs.php');

// POST 送信された内容を受け取る
$request = json_decode(file_get_contents('php://input'), true);

$bbs = new \MyApp\Bbs();

// POST された時だけ処理を行うための条件分岐
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  try {
    
    // フラグの存在チェック (兼 ID Match の場合)
    if (!isset($request['sendType']) || !isset($request['is_set_storage']))
      throw new \Exception('Flag Value is not set.');
    
    // 値の存在チェック
    // sage ボタンはチェックがあるときだけ送信されるので判定から除外する
    //
    // Submit の場合
    if (
      (isset($request['sendType']) && $request['sendType'] === 'is_post') &&
      (!isset($request['user']) || !isset($request['email']) || !isset($request['message']) || !isset($request['posted_num']) || !isset($request['token']))
    ) throw new \Exception('Submit Value is not set.');
    
    
    // Res Anchor の場合
    if (
      (isset($request['sendType']) && $request['sendType'] === 'is_resAnchor') &&
      (!isset($request['sendPostNumFirst']) ||
      !isset($request['sendPostNumLast']) && $request['sendPostNumLast'] !== null)
    ) throw new \Exception('Res Anchor Value is not set.');
    
    // 投稿の場合
    if ($request['sendType'] === 'is_post')
      // dat ファイルに書き込む
      $bbs->post($request);
    
    // dat ファイルを取得する
    $posts = $bbs->getPosts();
    
    // 取得した dat ファイルのデータから新しい(or 必要な)投稿だけを取得
    // $posts ： 投稿一覧  $request ： POST送信データ
    list($postNum, $user, $email, $postedAt, $uniqueId, $message, $postNumAll, $uniqueIdAll, $postsArrAll) = $bbs->getPostContents($posts, $request);
    
    // ID 重複リストの取得
    $matchIdArr= $bbs->getMatchId($uniqueIdAll);
  }
  catch (Exception $e) {
    // 例外が発生したら 500 番を返しつつエラーメッセージを表示する
    header($_SERVER['SERVER_PROTOCOL'] . '500 Internal Server Error', true, 500);
    
    // 例外メッセージの表示
    echo $e->getMessage();
    exit;
  }
  
  header('Content-Type: application/json; charset=utf-8');
  
  echo json_encode(
    [
      'postNum' => h($postNum),
      'user' => h($user),
      'email' => h($email),
      'postedAt' => h($postedAt),
      'uniqueId' => h($uniqueId),
      'message' => h($message),
      'matchIdArr' => h($matchIdArr),
      'postsArrAll' => h($postsArrAll)
    ],
    JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES
  );
  
} // end if

