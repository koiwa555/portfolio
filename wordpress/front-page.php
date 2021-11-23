  <?php get_header(); ?>
  
  <header id="header" class="u-bg_dark_gray">
    <div class="l-outer">
      <h1 class="main_head">
        <a href="<?=  esc_url(home_url()) ?>">
          <span class="u-en">
            <span class="u-br">Portfolio by </span>
            Hiroshi Koiwa
          </span>
        </a>
      </h1>
      
      <div id="slideNav" class="slide_nav">
        <div class="slide_nav_content_outer">
          <div id="slideNavContentInner" class="slide_nav_content_inner">
            
            <div id="sideNavContent" class="slide_nav_content">
              
              <nav id="pageNav" class="page_nav">
                <p class="page_nav-title u-before_font_icon">見出し</p>
                <ul>
                  <li class="u-before_symbol u-after_symbol">
                    <a href="#prof">
                      <span class="u-en u-after_symbol">Profile</span>
                    </a>
                  </li>
                  <li class="u-after_symbol">
                    <a href="#skill">
                      <span class="u-en u-after_symbol">Skill</span>
                    </a>
                  </li>
                  
              <?php
              // トップレベルのカテゴリ一覧の取得 (トップページ用)
              $args = array(
                'orderby'=> 'name',
                'order' => 'ASC',
                'parent' => 0, // トップレベルのみ
              );
              // 記事を出力するためのクエリ生成ではなく、カテゴリページ内からの
              // 処理でもなく、サイト内で利用しているカテゴリ一覧を取得するだけので
              // WP_Query() ではなく get_terms() を利用する。
              $categories = get_terms('category', $args);
              ?>
              <?php if (!empty($categories)) : ?> 
                <?php foreach($categories as $category) : ?>
                  
                  <li class="u-after_symbol">
                    <a href="#<?= $category->slug; ?>">
                      <span class="u-en u-after_symbol">
                        <?= $category->name; ?>
                      </span>
                    </a>
                  </li>
                  
                <?php endforeach; ?>
              <?php endif; ?>
                  
                </ul>
              </nav>
              
              <a id="toTop" class="to_top c-btn c-btn-up_arrow u-bg_dark_gray" href="#">
                TOPに戻る
              </a>
              
            </div>
            
          </div>
        </div><!-- #slideNavContentOuter -->
        <button id="slideNavToggleBtn" class="slide_nav-toggle_btn u-en" type="button">NAV</button>
        <div id="slideNavOverlay" class="slide_nav-overlay"></div>
      </div><!-- #slideNav -->
    </div><!-- .l-outer -->
  </header>
  
  <main id="main">
    <section id="prof" class="prof">
      <div class="l-outer">
        <div class="l-inner_first">
          
          <h2 class="prof-head c-large_head u-en">
            <span class="u-before_symbol u-after_symbol">Profile</span>
          </h2>
          
          <section class="prof-intro">
            <div class="prof-intro-outer">
              <div class="prof-intro-inner">
                <h3 class="prof-intro-head c-middle_head u-jp">小岩 洋志<span>（コイワ ヒロシ）</span></h3>
                <dl class="prof-intro-list">
                  <dt>年齢：</dt>
                  <dd>35歳</dd>
                  <dt>性別：</dt>
                  <dd>男</dd>
                  <dt>趣味：</dt>
                  <dd>猫と戯れる・音楽鑑賞</dd>
                </dl>
                <p class="prof-intro-hobby">休日は飼い猫の『テン君&#9794;』とまったり過ごすのが至福です。<br>
                好きな歌手は『坂本真綾』さんで、ライブを見に行くことで生きる活力を得ています。</p>
              </div>
              <p class="prof-intro-selfimg"><img src="<?= get_template_directory_uri(); ?>/assets/img/self.png" alt="自画像"></p>
            </div>
          </section><!-- h3 .prof-intro -->
          
          
          <section class="career-past u-border_bright_gray">
            <h3 class="career-past-head c-middle_head u-jp u-hiragana">
              <span class="career-past-head-inner u-hiragana">これまで<span class="u-en u-block">Until now</span></span>
            </h3>
            <ol class="career-past-list">
              <li class="career-past-list-item">① 学生時代はイラスト制作について学ぶ</li>
              <li class="career-past-list-item">② ECサイト運営で商品撮影や商品登録などを経験
                <ul class="career-past-list_in_list">
                  <li>・お客様に商品の魅力を届けることの楽しさを知る</li>
                  <li>・多彩な手法で情報を発信したいと考えるようになる</li>
                </ul>
              </li class="career-past-list-item">
              <li class="career-past-list-item">③ 半年間Webデザインの求職者支援訓練を受講</li>
              <li class="career-past-list-item">④ Webデザイナーとして3年半ほど従事する
                <ul class="career-past-list_in_list">
                  <li>・プログラミングに楽しさを見い出し始める</li>
                  <li>・独学でプログラミングについて勉強を続ける</li>
                </ul>
              </li>
            </ol>
          </section><!-- h3 -->
          <section class="career-future u-border_bright_gray">
            <h3 class="career-future-head c-middle_head u-jp">
              <span class="career-future-head-inner u-hiragana">これから<span class="u-en u-block">From now on</span></span>
            </h3>
            <p class="career-future-txt">現在は『OAシステム開発科』という1年間の職業訓練を受講中で、C言語・Java・SQLなどを学び、仕様書通りにプログラムを構築していくための方法について勉強しております。<br>
            また、独学ではありますが、PHPやWordPressの勉強も併用して行っています。<br>
            これまでの経験と、現在学んでいるスキルを合わせ、プログラマとして社会に貢献していきたいと考えています。</p>
          </section><!-- h3 -->
          
          <a class="pdf_link u-before_symbol" href="Hiroshi_Koiwa_Portfolio.pdf" target="_blank">
            <p class="pdf_link-txt">
              <!--
              <span class="pdf_link-txt-main u-br">PDF</span>
              <span class="pdf_link-txt-sub">Portfolio</span>
              -->
              <!-- PDF仮対処 -->
              <span class="pdf_link-txt-main u-br">WELCOME</span>
              <span class="pdf_link-txt-sub">to my site</span>
            </p>
          </a>
        </div>
      </div>
    </section><!-- h2 #prof -->
    
    
    <section id="skill" class="skill">
      <div class="l-outer">
        <div class="l-inner">
          
          <h2 class="skill-head c-large_head u-en">
            <span class="u-before_symbol u-after_symbol">Skill</span>
          </h2>
          <div class="skill-detail_wrap">
            
            <section class="skill-detail">
              <h3 class="skill-detail-head c-middle_head u-jp">
                <span class="u-en">JavaScript + jQuery</span>
              </h3>
              <ul class="skill-detail-list">
                <li>プログラムの基本理解
                  <span class="skill-star">
                    <i class="fa fa-star u-font_yellow" aria-hidden="true"></i>
                    <i class="fa fa-star u-font_yellow" aria-hidden="true"></i>
                    <i class="fa fa-star u-font_yellow" aria-hidden="true"></i>
                    <i class="fa fa-star" aria-hidden="true"></i>
                    <i class="fa fa-star" aria-hidden="true"></i>
                  </span>
                </li>
                <li>プラグインの理解と改変
                  <span class="skill-star">
                    <i class="fa fa-star u-font_yellow" aria-hidden="true"></i>
                    <i class="fa fa-star u-font_yellow" aria-hidden="true"></i>
                    <i class="fa fa-star u-font_yellow" aria-hidden="true"></i>
                    <i class="fa fa-star u-font_yellow" aria-hidden="true"></i>
                    <i class="fa fa-star" aria-hidden="true"></i>
                  </span>
                </li>
                <li>ajaxでのデータの受け渡し
                  <span class="skill-star">
                    <i class="fa fa-star u-font_yellow" aria-hidden="true"></i>
                    <i class="fa fa-star u-font_yellow" aria-hidden="true"></i>
                    <i class="fa fa-star u-font_yellow" aria-hidden="true"></i>
                    <i class="fa fa-star" aria-hidden="true"></i>
                    <i class="fa fa-star" aria-hidden="true"></i>
                  </span>
                </li>
              </ul>
            </section>
            
            <section class="skill-detail">
              <h3 class="skill-detail-head c-middle_head u-jp">
                <span class="u-en">PHP</span>
              </h3>
              <ul class="skill-detail-list">
                <li>プログラムの基本理解
                  <span class="skill-star">
                    <i class="fa fa-star u-font_yellow" aria-hidden="true"></i>
                    <i class="fa fa-star u-font_yellow" aria-hidden="true"></i>
                    <i class="fa fa-star u-font_yellow" aria-hidden="true"></i>
                    <i class="fa fa-star" aria-hidden="true"></i>
                    <i class="fa fa-star" aria-hidden="true"></i>
                  </span>
                </li>
                <li>簡易お問い合わせフォームの作成
                  <span class="skill-star">
                    <i class="fa fa-star u-font_yellow" aria-hidden="true"></i>
                    <i class="fa fa-star u-font_yellow" aria-hidden="true"></i>
                    <i class="fa fa-star" aria-hidden="true"></i>
                    <i class="fa fa-star" aria-hidden="true"></i>
                    <i class="fa fa-star" aria-hidden="true"></i>
                  </span>
                </li>
                <li>ファイルの操作
                  <span class="skill-star">
                    <i class="fa fa-star u-font_yellow" aria-hidden="true"></i>
                    <i class="fa fa-star u-font_yellow" aria-hidden="true"></i>
                    <i class="fa fa-star u-font_yellow" aria-hidden="true"></i>
                    <i class="fa fa-star" aria-hidden="true"></i>
                    <i class="fa fa-star" aria-hidden="true"></i>
                  </span>
                </li>
              </ul>
            </section>
            
            <section class="skill-detail">
              <h3 class="skill-detail-head c-middle_head u-jp">
                <span class="u-en">SQL</span></span>
                <span class="u-jp">（データベース）</span>
              </h3>
              <ul class="skill-detail-list">
                <li>プログラムの基本理解
                  <span class="skill-star">
                    <i class="fa fa-star u-font_yellow" aria-hidden="true"></i>
                    <i class="fa fa-star u-font_yellow" aria-hidden="true"></i>
                    <i class="fa fa-star u-font_yellow" aria-hidden="true"></i>
                    <i class="fa fa-star" aria-hidden="true"></i>
                    <i class="fa fa-star" aria-hidden="true"></i>
                  </span>
                </li>
                <li>データベースの正規化
                  <span class="skill-star">
                    <i class="fa fa-star u-font_yellow" aria-hidden="true"></i>
                    <i class="fa fa-star u-font_yellow" aria-hidden="true"></i>
                    <i class="fa fa-star" aria-hidden="true"></i>
                    <i class="fa fa-star" aria-hidden="true"></i>
                    <i class="fa fa-star" aria-hidden="true"></i>
                  </span>
                </li>
                <li>ER図の作成
                  <span class="skill-star">
                    <i class="fa fa-star u-font_yellow" aria-hidden="true"></i>
                    <i class="fa fa-star u-font_yellow" aria-hidden="true"></i>
                    <i class="fa fa-star" aria-hidden="true"></i>
                    <i class="fa fa-star" aria-hidden="true"></i>
                    <i class="fa fa-star" aria-hidden="true"></i>
                  </span>
                </li>
              </ul>
            </section>
            
            <section class="skill-detail">
              <h3 class="skill-detail-head c-middle_head u-jp">
                <span class="u-en">Java</span>
              </h3>
              <ul class="skill-detail-list">
                <li>オブジェクト指向についての理解
                  <span class="skill-star">
                    <i class="fa fa-star u-font_yellow" aria-hidden="true"></i>
                    <i class="fa fa-star u-font_yellow" aria-hidden="true"></i>
                    <i class="fa fa-star u-font_yellow" aria-hidden="true"></i>
                    <i class="fa fa-star" aria-hidden="true"></i>
                    <i class="fa fa-star" aria-hidden="true"></i>
                  </span>
                </li>
                <li>Servlet+JSPの理解
                  <span class="skill-star">
                    <i class="fa fa-star u-font_yellow" aria-hidden="true"></i>
                    <i class="fa fa-star u-font_yellow" aria-hidden="true"></i>
                    <i class="fa fa-star" aria-hidden="true"></i>
                    <i class="fa fa-star" aria-hidden="true"></i>
                    <i class="fa fa-star" aria-hidden="true"></i>
                  </span>
                </li>
                <li>MVCモデルでの開発
                  <span class="skill-star">
                    <i class="fa fa-star u-font_yellow" aria-hidden="true"></i>
                    <i class="fa fa-star u-font_yellow" aria-hidden="true"></i>
                    <i class="fa fa-star" aria-hidden="true"></i>
                    <i class="fa fa-star" aria-hidden="true"></i>
                    <i class="fa fa-star" aria-hidden="true"></i>
                  </span>
                </li>
              </ul>
            </section>
            
            <section class="skill-detail">
              <h3 class="skill-detail-head c-middle_head u-jp">
                <span class="u-en">C</span>
                <span class="u-jp">言語</span>
              </h3>
              <ul class="skill-detail-list">
              <li>手続き型言語の理解
                  <span class="skill-star">
                    <i class="fa fa-star u-font_yellow" aria-hidden="true"></i>
                    <i class="fa fa-star u-font_yellow" aria-hidden="true"></i>
                    <i class="fa fa-star u-font_yellow" aria-hidden="true"></i>
                    <i class="fa fa-star" aria-hidden="true"></i>
                    <i class="fa fa-star" aria-hidden="true"></i>
                  </span>
                </li>
                <li>ポインタの活用
                  <span class="skill-star">
                    <i class="fa fa-star u-font_yellow" aria-hidden="true"></i>
                    <i class="fa fa-star u-font_yellow" aria-hidden="true"></i>
                    <i class="fa fa-star u-font_yellow" aria-hidden="true"></i>
                    <i class="fa fa-star" aria-hidden="true"></i>
                    <i class="fa fa-star" aria-hidden="true"></i>
                  </span>
                </li>
                <li>メモリを意識したアルゴリズムの構築
                  <span class="skill-star">
                    <i class="fa fa-star u-font_yellow" aria-hidden="true"></i>
                    <i class="fa fa-star u-font_yellow" aria-hidden="true"></i>
                    <i class="fa fa-star" aria-hidden="true"></i>
                    <i class="fa fa-star" aria-hidden="true"></i>
                    <i class="fa fa-star" aria-hidden="true"></i>
                  </span>
                </li>
              </ul>
            </section>
            
            <section class="skill-detail">
              <h3 class="skill-detail-head c-middle_head u-jp">
                <span class="u-en">HTML5 + CSS3</span>
              </h3>
              <ul class="skill-detail-list">
                <li>タグ要素とCSSの理解
                  <span class="skill-star">
                    <i class="fa fa-star u-font_yellow" aria-hidden="true"></i>
                    <i class="fa fa-star u-font_yellow" aria-hidden="true"></i>
                    <i class="fa fa-star u-font_yellow" aria-hidden="true"></i>
                    <i class="fa fa-star u-font_yellow" aria-hidden="true"></i>
                    <i class="fa fa-star" aria-hidden="true"></i>
                  </span>
                </li>
                <li>デザインカンプを元にしたページ作成
                  <span class="skill-star">
                    <i class="fa fa-star u-font_yellow" aria-hidden="true"></i>
                    <i class="fa fa-star u-font_yellow" aria-hidden="true"></i>
                    <i class="fa fa-star u-font_yellow" aria-hidden="true"></i>
                    <i class="fa fa-star u-font_yellow" aria-hidden="true"></i>
                    <i class="fa fa-star" aria-hidden="true"></i>
                  </span>
                </li>
                <li>CSS3でのアニメーション効果
                  <span class="skill-star">
                    <i class="fa fa-star u-font_yellow" aria-hidden="true"></i>
                    <i class="fa fa-star u-font_yellow" aria-hidden="true"></i>
                    <i class="fa fa-star u-font_yellow" aria-hidden="true"></i>
                    <i class="fa fa-star u-font_yellow" aria-hidden="true"></i>
                    <i class="fa fa-star" aria-hidden="true"></i>
                  </span>
                </li>
              </ul>
            </section>
            
            <section class="skill-detail">
              <h3 class="skill-detail-head c-middle_head u-jp">
                <span class="u-en">Photoshop + Illustrator</span>
              </h3>
              <ul class="skill-detail-list">
                <li>写真のレタッチ
                  <span class="skill-star">
                    <i class="fa fa-star u-font_yellow" aria-hidden="true"></i>
                    <i class="fa fa-star u-font_yellow" aria-hidden="true"></i>
                    <i class="fa fa-star u-font_yellow" aria-hidden="true"></i>
                    <i class="fa fa-star u-font_yellow" aria-hidden="true"></i>
                    <i class="fa fa-star" aria-hidden="true"></i>
                  </span>
                </li>
                <li>Web用パーツの作成
                  <span class="skill-star">
                    <i class="fa fa-star u-font_yellow" aria-hidden="true"></i>
                    <i class="fa fa-star u-font_yellow" aria-hidden="true"></i>
                    <i class="fa fa-star u-font_yellow" aria-hidden="true"></i>
                    <i class="fa fa-star" aria-hidden="true"></i>
                    <i class="fa fa-star" aria-hidden="true"></i>
                  </span>
                </li>
                <li>印刷物の作成
                  <span class="skill-star">
                    <i class="fa fa-star u-font_yellow" aria-hidden="true"></i>
                    <i class="fa fa-star u-font_yellow" aria-hidden="true"></i>
                    <i class="fa fa-star" aria-hidden="true"></i>
                    <i class="fa fa-star" aria-hidden="true"></i>
                    <i class="fa fa-star" aria-hidden="true"></i>
                  </span>
                </li>
              </ul>
            </section>
            
            <section class="skill-detail">
              <h3 class="skill-detail-head c-middle_head u-jp">
                <span class="u-jp">開発環境</span>
              </h3>
              <dl class="skill-detail-list">
                <dt>OS<span>：</span></dt>
                <dd>Windows 10</dd>
                <dt>Git<span>：</span></dt>
                <dd>Sourcetree・GitHub</dd>
                <dt>PHP<span>：</span></dt>
                <dd>XAMPP</dd>
                <dt>エディタ<span>：</span></dt>
                <dd>Visual Studio Code・Dreamweaver</dd>
              </dl>
            </section><!-- h3 -->
            
          </div><!-- .skill-detail_wrap -->
          
        </div><!-- .skill-outer -->
      </div><!-- .skill-outer -->
    </section><!-- h3 #skill -->
    
    
    <?php
    // $categories (トップレベルのカテゴリ一覧) はヘッダナビで既に取得済
    ?>
    <?php if (!empty($categories)) : ?>
      <?php foreach($categories as $category) : ?>
        <?php
        $tpl_args = array(
          'slug' => $category->slug, // スラッグ名
          'name' => $category->name, // カテゴリー名
          // 子カテゴリ
          // 取得するだけで存在チェックは後で行う
          // term_id は文字列なので [(int)] でキャストする
          'children_id' => get_term_children((int)$category->term_id, 'category'),
        );
        
        get_template_part('template-parts/loop-category-section', null, $tpl_args);
        
        // 第1階層のカテゴリループ
        ?>
      <?php endforeach; ?>
    <?php endif; ?>
    
  </main>
  
  <div id="toTopCircleOuter" class="p-to_top-circle-outer">
    <div class="p-to_top-circle-wrap">
      <a id="toTopCircle" class="p-to_top-circle c-btn_circle c-btn_circle-up_arrow u-bg_dark_gray" href="#"></a>
    </div>
  </div>
  <?php get_footer(); ?>