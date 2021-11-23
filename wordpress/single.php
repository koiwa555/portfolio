  <?php get_header(); ?>
  <?php get_template_part('template-parts/subpage-header'); ?>
  
  <div class="container u-bg-product">
    <div class="l-outer">
      <div class="l-inner">
        <main id="main" class="main">
        
      <?php if (have_posts()): ?>
        <?php while (have_posts()): the_post(); ?>
          <article id="post-<?php the_ID(); ?>" <?php post_class('article u-border_content_outline'); ?>>
            <h1><?php the_title(); ?></h1>
            <!-- テンプレート化したパンくずリストを出力する -->
            <?php get_template_part('template-parts/breadcrumb'); ?> 
            <?php the_content(); ?>
          </article>
        <?php endwhile ?>
      <?php endif; ?>
        
        </main>
        
        <div class="side_content">
          <div id="sideContentInner" class="side_content-inner">
            
            <aside id="slideNav" class="slide_nav">
              <div class="slide_nav_content_outer">
                <div id="slideNavContentInner" class="slide_nav_content_inner">
                  
                  <div id="sideNavContent" class="slide_nav_content">
                    
                    <div id="pageNav" class="page_nav">
                      <p class="page_nav-title u-before_font_icon u-post_main_color">見出し</p>
                      <div class="u-border_content_outline">
                        
                        <!-- サイドバーを出力する -->
                        <?php if (is_active_sidebar('page_nav')) dynamic_sidebar('page_nav'); ?> 
                        
                      </div>
                    </div>
                    
                    <a id="toTop" class="to_top c-btn c-btn-up_arrow u-bg_dark_gray" href="#">
                      TOPに戻る
                    </a>
                    
                  </div>
                  
                </div>
              </div>
              <button id="slideNavToggleBtn" class="slide_nav-toggle_btn u-en" type="button">NAV</button>
              <div id="slideNavOverlay" class="slide_nav-overlay"></div>
            </aside>
            
            
        <!-- カテゴリがpractice または coding の場合はデモとソースコードへのリンクを作る -->
        <?php if(in_category(array('practice', 'coding'))) : ?> 
          <?php
          global $post;
          
          $slug = $post->post_name;
          $url = home_url();
          
          // [0] ： [D:\Documents\Tasks\xampp\htdocs\koiwapf_wp/]
          // [1] ： [wp-content/themes/own]
          $path = explode('/wp-content', get_template_directory());
          $demo_dir = '/demo/' . $slug . '/';
          
          // ディレクトリ
          // D:\Documents\Tasks\xampp\htdocs\koiwapf_wp/demo/js_smooth_scroll/
          // echo $path[0] . $demo_dir;
          
          // URL
          // http://localhost/koiwapf_wp/demo/js_smooth_scroll/
          // echo home_url() . $demo_dir;
          
          // GitHub の URL
          $source_url = "https://github.com/koiwa555/portfolio/tree/main/";
          
          // スラッグ名を用いたディレクトリが存在すれば、デモページが存在することになる
          $is_demo = file_exists($path[0] . $demo_dir);
          // ソースページはタグの有無で存在チェック
          $is_source = has_tag('Source');
          ?>
          <?php if($is_demo || $is_source) : ?> 
            <!-- デモページまたはソースページがある場合 -->
            <aside id="sampleNav" class="sample_nav u-border_content_outline">
              <nav>
                <div class="l-outer">

                <?php if($is_demo && $is_source) : ?> 
                  <!-- デモページとソースページがある場合 -->
                  <ul class="sample_nav-list sample_nav-list-half">
                    
                    <li class="u-after_symbol">
                      <!--
                      [/demo/スラッグ名] の形式でデモのリンクを出力する
                      -->
                      <a href="<?= esc_url($url . $demo_dir); ?>" target=”_blank”>
                        デモページ
                      </a>
                    </li>
                    <li>
                      <a href="<?= esc_url($source_url . $slug . "/"); ?>" target=”_blank”>
                        ソースページ
                      </a>
                    </li>
                  </ul>
                <?php elseif ($is_demo) : ?> 
                  <!-- デモページだけある場合 -->
                  <ul class="sample_nav-list sample_nav-list-full">
                    <li>
                      <a href="<?= esc_url($url . $demo_dir); ?>">
                        デモページ
                      </a>
                    </li>
                  </ul>
                <?php else : ?> 
                  <ul class="sample_nav-list sample_nav-list-full">
                    <li>
                    <a href="<?= esc_url($source_url . $slug . "/"); ?>" target=”_blank”>
                        ソースページ
                      </a>
                    </li>
                  </ul>
                <?php endif; ?>
                
                </div>
              </nav>
            </aside>
          <?php endif; ?>
        <?php endif; ?>
            
          </div>
        </div><!-- .side_content -->
        
      </div>
    </div>
  </div><!-- container -->
  
  <div id="invisibleHeader" class="invisible_header"></div>
  
  <?php get_footer(); ?> 
