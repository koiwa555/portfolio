  
  <footer id="footer">
    <div class="footer_nav_outer">
      <div class="l-outer">
        <nav class="footer_nav u-en">
          <ul class="parent">
            
            <?php
            $args = array(
              'show_option_all' => 'Home',
              'title_li' => '',
            );
            wp_list_categories($args);
            ?>
            
          </ul>
        </nav>
      </div>
    </div>
      <p class="u-bg_dark_gray">
        Copyright&copy;2021 Hiroshi Koiwa<br class="u-sp_br"> All Rights Reserved.
      </p>
  </footer>
  
<?php wp_footer(); ?>
</body>
</html>
