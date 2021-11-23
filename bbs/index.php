<?php
  require_once(__DIR__ . '/config.php');
  require_once(__DIR__ . '/functions.php');
  require_once(__DIR__ . '/bbs.php');
  
  $bbs = new \MyApp\Bbs();
  
  $posts = $bbs->getPosts();
  
  list($postNum, $user, $email, $postedAt, $uniqueId, $message) = $bbs->getPostContents($posts, null);
  
  // IDの重複抽出用に配列の原本を残しておく
  // 呼び出すメソッド側での処理で配列の値を削除しながら進めるため
  $uniqueIdOrig = $uniqueId;
  $matchIdArr = $bbs->getMatchId($uniqueIdOrig);
?>

<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>掲示板</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="style.css">
</head>
<body id="body">
  
  <div class="container">
  
    <header id="header">
      <h1>【猫だけ】 にゃんこ　猫についての総合スレ Part3</h1>
    </header>
    
    <main>
      <div class="inner_wrap">
        <div class="inner">
          
          <a class="to_how_to" href="#post501">使い方は 501～504 番にありますので、<span class="u-split">一度移動してください。</span></a>
          
          <ol id="postList" class="post_list">
            <!-- 投稿がある場合 -->
            <?php if(count($postNum)) : ?>
              <?php foreach ($postNum as $i => $v) : ?>
                <li id="post<?= h($postNum[$i]); ?>">
                  <div class="post_inner_wrap">
                    <span class="post_num">
                      <?= h($postNum[$i]); ?>
                    </span>
                    
                    <?php if ($email[$i]) : ?>
                      <a class="post_user" href="mailto:<?= h($email[$i]); ?>">
                        <?= h($user[$i]); ?>
                      </a>
                    <?php else : ?>
                      <span class="post_user">
                        <?= h($user[$i]); ?>
                      </span>
                    <?php endif; ?>
                    
                    <span class="post_date">
                      <?= h($postedAt[$i]); ?>
                    </span>
                    <span class="post_unique_id">
                      <?= $bbs->setUniqueId(h($uniqueId[$i]), $postNum[$i], $matchIdArr); ?>
                    </span>
                    <div class="post_message">
                      <?= $bbs->setMessage(h($message[$i])); ?>
                    </div>
                  </div>
                </li>
              <?php endforeach; ?>
              
              
            <!-- 投稿がない場合 -->
            <?php else : ?>
              <li>まだ投稿はありません。</li>
            <?php endif; ?>
          </ol>
        </div><!-- inner -->
      </div><!-- inner_wrap -->
    </main>
    
    
    <aside id="sideNavBtn" class="side_nav_btn is-floated">
      <div id="sideNavListWrap">
      <ul id="sideNavList">
        <li class="side_nav_list_item"><a href="#post1">001</a></li>
        <li class="side_nav_list_item is-hide"><a href="#post100">100</a></li>
        <li class="side_nav_list_item is-hide"><a href="#post200">200</a></li>
        <li class="side_nav_list_item is-hide"><a href="#post300">300</a></li>
        <li class="side_nav_list_item is-hide"><a href="#post400">400</a></li>
        <li class="side_nav_list_item is-hide"><a href="#post500">500</a></li>
        <li class="side_nav_list_item is-hide"><a href="#post600">600</a></li>
        <li class="side_nav_list_item is-hide"><a href="#post700">700</a></li>
        <li class="side_nav_list_item is-hide"><a href="#post800">800</a></li>
        <li class="side_nav_list_item is-hide"><a href="#post900">900</a></li>
        <li class="side_nav_list_item"><a id="sideNavLatest" href="#post900">Latest</a></li>
      </ul>
      </div>
      
      <button id="sideNavToggleBtn" type="button">NAV</button>
      <div id="sideNavOverlay"></div>
    </aside>
    
    
    <footer>
      <button id="formSlideBtn" type="button">
        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="pen" class="svg-inline--fa fa-pen fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M290.74 93.24l128.02 128.02-277.99 277.99-114.14 12.6C11.35 513.54-1.56 500.62.14 485.34l12.7-114.22 277.9-277.88zm207.2-19.06l-60.11-60.11c-18.75-18.75-49.16-18.75-67.91 0l-56.55 56.55 128.02 128.02 56.55-56.55c18.75-18.76 18.75-49.16 0-67.91z"></path></svg>
      </button>
      
      <form action="" method="post">
        <div class="settings u-inline_block_wrap">
          <div class="user u-inline_block_wrap">
            <label for="user">名前:</label>
            <input id="user" type="text" name="user">
          </div>
          
          <div class="email u-inline_block_wrap">
            <label for="email">E-mail:</label>
            <input id="email" type="text" name="email">
          </div>
          
          <div class="btn_wrap u-inline_block_wrap">
            <div class="sage u-inline_block_wrap">
              <input id="sage" type="checkbox" name="sage" value="sage">
              <label id="sage_label" for="sage">sage</label>
            </div>
            
            <input id="submit" type="submit" value="書き込む">
          </div>
        </div>
        
        <textarea id="message" name="message" rows="6" cols="80"></textarea>
        
        <!-- ロード時に取得したレス数 または投稿後に取得したレス数 -->
        <input id="postNum" type="hidden" name="posted_num" value="<?= h(count($posts)); ?>">
        
        <!-- トークンを仕込む -->
        <input type="hidden" name="token" value="<?= h($_SESSION['token']); ?>">
      </form>
    </footer>
  
  </div><!-- container -->
  
  
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
  <script src="bbs.js"></script>
  <script src="float_scroll.js"></script>
  <script>
    var setFloatOptions = function() {
      var floatOptions = [
        {
          id: 'header',
          addHeightTargetId: 'body',
          addHeightDirection: 'top',
        }
      ];
      floatContent(floatOptions);
    };
    setFloatOptions();
    
    var setSmoothScrollOptions = function() {
      var smoothScrollOptions = {
        easing: 'easeInCubic',
        duration: {
          anchor: 400,
          urlHash: 0,
        },
        dynamic: {
          support: true,
        },
        floatTopElem: [
          {
            id: 'header',
            alwaysFloated: true
          }
        ],
      };
      smoothScroll(smoothScrollOptions);
    };
    setSmoothScrollOptions();
  </script>
</body>
</html>

