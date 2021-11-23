          <?php
          // インクルード元からの引数を変数に代入
          // ※[$args] は角ページごとで WP が利用する変数名なので
          $tpl_parent = $args;
          ?>
          
          <div class="p-content-group">
            <div class="p-content-wrap">
              <!-- WP loop -->
              
          <?php
          $args = array(
            'post_type' => 'post',
            // 'posts_per_page' => 6,
            'no_found_rows' => true,
            'order' => 'DESC',
            'orderby' => 'menu_order',
          );
          
          // 子カテゴリの有無でクエリの内容を変更する
          // 子カテゴリがある場合はカテゴリ id をクエリに追加
          if (!empty($tpl_parent['child_id'])) {
            $args['cat'] = $tpl_parent['child_id'];
          } else {
            // 子カテゴリがない場合は slug 名をカテゴリ名としてクエリに追加
            $args['category_name'] = $tpl_parent['slug'];
          }
          
          // 記事ページではないので自分でクエリを生成して記事情報を取得する。
          $the_query = new WP_Query($args);
          ?>
          <?php if ($the_query->have_posts()) : ?>
            <?php while ($the_query->have_posts()) : $the_query->the_post(); ?>
              
              <!-- 投稿カード -->
              <article class="p-content u-border_content_outline">
                <a href="<?php the_permalink(); ?>">
                  
                <?php $tags = get_the_tags(); ?>
                  
                <?php if (!empty($tags)) : ?> 
                  <!-- タグがある場合 -->
                  <dl class="p-content-detail p-content-detail-with_icon">
                <?php else : ?> 
                  <!-- タグがない場合 -->
                  <dl class="p-content-detail p-content-detail-without_icon">
                <?php endif; ?>
                    
                    <dt>
                      <?php display_thumbnail() ?> 
                    </dt>
                    <dd>
                      
                <?php if (is_home()) : ?> 
                  <!-- トップページ -->
                  <?php if (!empty($tpl_parent['child_id'])) : ?> 
                    <!-- 子カテゴリ持ちの場合 -->
                    <h4 class="c-small_head u-border_bright_gray">
                      <span><?php the_title(); ?></span>
                    </h4>
                  <?php else : ?> 
                    <!-- 子カテゴリ持ちでない場合 -->
                    <h3 class="c-small_head u-border_bright_gray">
                      <span><?php the_title(); ?></span>
                    </h3>
                  <?php endif; ?>
                  
                <?php else : ?> 
                    <!-- カテゴリページ -->
                  <?php if (!empty($tpl_parent['child_id'])) : ?> 
                    <!-- 子カテゴリ持ちの場合 -->
                    <h3 class="c-small_head u-border_bright_gray">
                      <span><?php the_title(); ?></span>
                    </h3>
                  <?php else : ?> 
                    <!-- 子カテゴリ持ちでない場合 -->
                    <h2 class="c-small_head u-border_bright_gray">
                      <span><?php the_title(); ?></span>
                    </h2>
                  <?php endif; ?>
                  
                <?php endif; ?>
                    
                    
                    <?php the_excerpt(); ?>
                    
                    <!-- タグの出力 -->
                  <?php if (!empty($tags)) : ?> 
                    <ul class="p-content-icon_list u-en">
                      <!-- タグのスラッグ名をクラス名として動的に指定する -->
                      <?php foreach($tags as $tag) : ?> 
                        <li class="c-icon u-bg-<?= $tag->slug; ?>">
                          <?= $tag->name; ?>
                        </li>
                      <?php endforeach; ?>
                    </ul>
                  <?php endif; ?>
                      
                    </dd>
                  </dl>
                </a>
              </article>
              
            <?php endwhile; ?>
          <?php endif; ?>
          <?php
          // ループ後のリセット処理
          wp_reset_postdata();
          ?> 
              <!-- WP end -->
              
            </div>
          </div><!-- .p-content-group -->
          