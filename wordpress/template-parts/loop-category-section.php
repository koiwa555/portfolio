    <?php
    // インクルード元からの引数を変数に代入
    // ※[$args] は角ページごとで WP が利用する変数名なので
    $tpl_parent = $args;
    ?>
    
    <section
      id="<?= $tpl_parent['slug']; ?>"
      class="<?= $tpl_parent['slug']; ?> product u-bg-product"
    >
      <div class="l-outer">
        <div class="l-inner">
          
        <?php if (is_home()) : ?> 
          <!-- トップページ -->
          <h2 class="<?= $tpl_parent['slug']; ?>-head c-large_head u-en">
            <span class="u-before_symbol u-after_symbol">
              <?php // echo $category->name; ?> 
              <?= $tpl_parent['name']; ?> 
            </span>
          </h2>
        <?php else : ?> 
          <!-- カテゴリページ -->
          <h1 class="<?= $tpl_parent['slug']; ?>-head c-large_head u-en">
            <span class="u-before_symbol u-after_symbol">
              <?= $tpl_parent['name']; ?> 
            </span>
          </h1>
        <?php endif; ?>
          
          
          
      <?php if (!empty($tpl_parent['children_id'])) : ?>
          <!-- 子カテゴリがある場合 -->
        <?php foreach($tpl_parent['children_id'] as $child_id) : ?>
          <?php
          // 子カテゴリの情報を取得
          $child = get_category($child_id);
          ?>
          
          <section class="<?= $child->slug; ?> product-sub_category">
            
          <?php if (is_home()) : ?> 
            <!-- トップページ -->
            <h3 class="<?= $tpl_parent['slug']; ?>-sub_head c-middle_head u-en">
              <span class="u-before_symbol u-after_symbol">
                <span class="u-bg-product"><?= $child->name; ?></span>
              </span>
            </h3>
          <?php else : ?> 
            <!-- カテゴリページ -->
            <h2 class="<?= $tpl_parent['slug']; ?>-sub_head c-middle_head u-en">
              <span class="u-before_symbol u-after_symbol">
                <span class="u-bg-product"><?= $child->name; ?></span>
              </span>
            </h2>
          <?php endif; ?>
            
          <?php
          // インクルード先へ子カテゴリ名の配列を渡すために
          // 連想配列の形式で格納する
          $tpl_args = array(
            'child_id' => $child_id,
          );
          
          get_template_part('template-parts/loop-category-posts-list', null, $tpl_args);
          ?>
            
          </section><!-- h3 -->
          
        <?php endforeach; ?>
      <?php else : ?> 
          <!-- 子カテゴリがない場合 -->
        <?php
          $tpl_args = array(
            'slug' => $tpl_parent['slug'],
          );
          
          get_template_part('template-parts/loop-category-posts-list', null, $tpl_args);
        ?>
      <?php endif; ?>
        
        </div>
      </div>
    </section><!-- h2 or h1 -->
    