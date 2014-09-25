(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) {
      for (var key in parent) {
        if (__hasProp.call(parent, key)) child[key] = parent[key];
      }

      function ctor() {
        this.constructor = child;
      }
      ctor.prototype = parent.prototype;
      child.prototype = new ctor();
      child.__super__ = parent.prototype;
      return child;
    };

  window.NavigationView = (function(_super) {

    __extends(NavigationView, _super);

    function NavigationView() {
      return NavigationView.__super__.constructor.apply(this, arguments);
    }

    NavigationView.prototype.events = {
      'click .header-drawer .has-dropdown': 'touchNavigation',
      'touchend .header-tools .has-dropdown': 'touchNavigation'
    };

    NavigationView.prototype.initialize = function() {};

    NavigationView.prototype.touchNavigation = function(e) {
      if ($(e.target).parent().hasClass('has-dropdown') || $(e.target).is('.has-dropdown')) {
        e.preventDefault();
        return $(e.currentTarget).toggleClass('open');
      }
    };

    NavigationView.prototype.render = function() {};

    return NavigationView;

  })(Backbone.View);

}).call(this);
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) {
      for (var key in parent) {
        if (__hasProp.call(parent, key)) child[key] = parent[key];
      }

      function ctor() {
        this.constructor = child;
      }
      ctor.prototype = parent.prototype;
      child.prototype = new ctor();
      child.__super__ = parent.prototype;
      return child;
    };

  window.HeaderView = (function(_super) {

    __extends(HeaderView, _super);

    function HeaderView() {
      return HeaderView.__super__.constructor.apply(this, arguments);
    }

    HeaderView.prototype.events = {
      'click .header-search-toggle': 'openSearch',
      'blur .header-search-input': 'closeSearch',
      'click .drawer-toggle': 'toggleCollapsedNav'
    };

    HeaderView.prototype.initialize = function(options) {
      var _this = this;
      new NavigationView({
        el: $(document.body)
      });
      this.mainHeader = this.$el.find('.main-header');
      this.drawer = options.drawer;
      this.drawer.find('.drawer-toggle').on('click', function() {
        return _this.toggleCollapsedNav();
      });
      if (Theme.headerSticky && $('html').hasClass('no-touch')) {
        this.stickyHeader();
      } else {
        this.$el.removeClass('sticky-header');
      }
      if (Theme.headerNavigation) {
        this.calculateHeaderWidths();
        $(window).resize(function() {
          return _this.fitHeader();
        });
      }
      if ($('html').hasClass('lt-ie9')) {
        this.verticallyCenterShopName();
        if (Theme.logo) {
          return this.verticallyCenterLogo();
        }
      }
    };

    HeaderView.prototype.stickyHeader = function() {
      var _this = this;
      if (theme.isHome && this.$el.hasClass('full-bleed-slideshow')) {
        return $(window).on('scroll', function(e) {
          var scrollPosition;
          scrollPosition = $(window).scrollTop();
          scrollPosition = scrollPosition < 0 ? 0 : scrollPosition;
          _this.$el.toggleClass('full-bleed-slideshow', scrollPosition === 0);
          return _this.$el.toggleClass('lower-than-slideshow', scrollPosition > 0);
        });
      }
    };

    HeaderView.prototype.calculateHeaderWidths = function() {
      var _this = this;
      return this.$el.imagesLoaded(function() {
        var brandingWidth, toolsWidth;
        brandingWidth = _this.$('.branding').outerWidth(true);
        toolsWidth = _this.$('.header-tools').outerWidth(true);
        if (brandingWidth === 0 && _this.$('a.logo').length) {
          brandingWidth = _this.$('.branding a.logo img:first-child').width();
        }
        _this.combinedWidth = brandingWidth + toolsWidth;
        return _this.fitHeader();
      });
    };

    HeaderView.prototype.fitHeader = function() {
      var headerWidth;
      headerWidth = this.mainHeader.width();
      return this.mainHeader.toggleClass('collapsed-navigation', this.combinedWidth + 45 > headerWidth);
    };

    HeaderView.prototype.toggleCollapsedNav = function(e) {
      if (e) {
        e.stopPropagation();
        e.preventDefault();
      }
      $(document.body).toggleClass('showing-drawer');
      if (Modernizr.csstransitions) {
        return this.$el.one('transitionend', function() {
          return $(document.body).toggleClass('drawer-visible');
        });
      } else {
        return $(document.body).toggleClass('drawer-visible');
      }
    };

    HeaderView.prototype.openSearch = function() {
      var _this = this;
      if (window.innerWidth <= 720) {
        window.location.href = '/search';
        return;
      }
      this.$('.header-search-form').addClass('active').find('input').focus();
      return this.$('.header-search-form').on('keyup.search', function(e) {
        if (e.keyCode === 27) {
          return _this.closeSearch();
        }
      });
    };

    HeaderView.prototype.closeSearch = function() {
      return this.$('.header-search-form').removeClass('active').off('keyup.search');
    };

    HeaderView.prototype.verticallyCenterLogo = function() {
      var _this = this;
      return this.$el.imagesLoaded(function() {
        var logoHeight;
        logoHeight = _this.$('.logo-regular').height();
        return _this.$('a.logo img').css({
          marginTop: -(logoHeight / 2)
        });
      });
    };

    HeaderView.prototype.verticallyCenterShopName = function() {
      var shopNameHeight;
      shopNameHeight = this.drawer.find('h1 a').height();
      return this.drawer.find('h1 a').css({
        marginTop: -(shopNameHeight / 2)
      });
    };

    HeaderView.prototype.render = function() {};

    return HeaderView;

  })(Backbone.View);

}).call(this);
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) {
      for (var key in parent) {
        if (__hasProp.call(parent, key)) child[key] = parent[key];
      }

      function ctor() {
        this.constructor = child;
      }
      ctor.prototype = parent.prototype;
      child.prototype = new ctor();
      child.__super__ = parent.prototype;
      return child;
    };

  window.ZoomView = (function(_super) {

    __extends(ZoomView, _super);

    function ZoomView() {
      return ZoomView.__super__.constructor.apply(this, arguments);
    }

    ZoomView.prototype.events = {
      'prepare-zoom': 'prepareZoom',
      'click': 'toggleZoom',
      'mouseout .product-image-zoom': 'toggleZoom',
      'mousemove .product-image-zoom': 'zoomImage'
    };

    ZoomView.prototype.initialize = function() {
      var _this = this;
      this.zoomArea = this.$('.product-image-zoom');
      return this.$el.imagesLoaded(function() {
        return _this.prepareZoom();
      });
    };

    ZoomView.prototype.prepareZoom = function() {
      var newImage, photoAreaHeight, photoAreaWidth,
        _this = this;
      photoAreaWidth = this.$el.width();
      photoAreaHeight = this.$el.height();
      newImage = new Image();
      $(newImage).on('load', function() {
        var ratio, ratios;
        _this.zoomImageWidth = newImage.width;
        _this.zoomImageHeight = newImage.height;
        ratios = new Array();
        ratios[0] = _this.zoomImageWidth / photoAreaWidth;
        ratios[1] = _this.zoomImageHeight / photoAreaHeight;
        ratio = Math.max.apply(Math, ratios);
        if (ratio < 1.4) {
          _this.$el.removeClass('zoom-enabled');
        } else {
          _this.$el.addClass('zoom-enabled');
          return _this.zoomArea.css({
            backgroundImage: "url(" + newImage.src + ")"
          });
        }
      });
      return newImage.src = this.$('img').attr('src');
    };

    ZoomView.prototype.toggleZoom = function(e) {
      if (this.$el.hasClass('zoom-enabled')) {
        if (e.type === 'mouseout') {
          this.zoomArea.removeClass('active');
          return;
        }
        if (this.zoomArea.hasClass('active')) {
          this.zoomArea.removeClass('active');
        } else {
          this.zoomArea.addClass('active');
        }
        return this.zoomImage(e);
      }
    };

    ZoomView.prototype.zoomImage = function(e) {
      var bigImageOffset, bigImageX, bigImageY, mousePositionX, mousePositionY, newBackgroundPosition, ratioX, ratioY, zoomHeight, zoomWidth;
      zoomWidth = this.zoomArea.width();
      zoomHeight = this.zoomArea.height();
      bigImageOffset = this.$el.offset();
      bigImageX = Math.round(bigImageOffset.left);
      bigImageY = Math.round(bigImageOffset.top);
      mousePositionX = e.pageX - bigImageX;
      mousePositionY = e.pageY - bigImageY;
      if (mousePositionX < zoomWidth && mousePositionY < zoomHeight && mousePositionX > 0 && mousePositionY > 0) {
        if (this.zoomArea.hasClass('active')) {
          ratioX = Math.round(mousePositionX / zoomWidth * this.zoomImageWidth - zoomWidth / 2) * -1;
          ratioY = Math.round(mousePositionY / zoomHeight * this.zoomImageHeight - zoomHeight / 2) * -1;
          if (ratioX > 0) {
            ratioX = 0;
          }
          if (ratioY > 0) {
            ratioY = 0;
          }
          if (ratioX < -(this.zoomImageWidth - zoomWidth)) {
            ratioX = -(this.zoomImageWidth - zoomWidth);
          }
          if (ratioY < -(this.zoomImageHeight - zoomHeight)) {
            ratioY = -(this.zoomImageHeight - zoomHeight);
          }
          newBackgroundPosition = "" + ratioX + "px " + ratioY + "px";
          return this.zoomArea.css({
            backgroundPosition: newBackgroundPosition
          });
        }
      }
    };

    return ZoomView;

  })(Backbone.View);

}).call(this);
(function() {
  var __bind = function(fn, me) {
    return function() {
      return fn.apply(me, arguments);
    };
  },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) {
      for (var key in parent) {
        if (__hasProp.call(parent, key)) child[key] = parent[key];
      }

      function ctor() {
        this.constructor = child;
      }
      ctor.prototype = parent.prototype;
      child.prototype = new ctor();
      child.__super__ = parent.prototype;
      return child;
    };

  window.ProductView = (function(_super) {

    __extends(ProductView, _super);

    function ProductView() {
      this.selectCallback = __bind(this.selectCallback, this);
      return ProductView.__super__.constructor.apply(this, arguments);
    }

    ProductView.prototype.events = {
      'change .product-options select': 'updateVariantLabel',
      'change .single-option-selector': 'associateImageVariant',
      'click .product-thumbnails img': 'updateProductImage',
      'submit .product-form': 'addToCart'
    };

    ProductView.prototype.initialize = function() {
      var select, selectableOptions, _i, _len,
        _this = this;
      this.addToCartButton = this.$('.add-to-cart input');
      this.priceArea = this.$('.product-price');
      this.options = window.productJSON.options;
      this.variants = window.productJSON.variants;
      this.noImageURL = this.$('.product-big-image').data('no-image-svg');
      if ($('html').hasClass('no-svg')) {
        this.noImageURL = this.$('.product-big-image').data('no-image-png');
      }
      this.processing = false;
      if (this.variants.length > 1) {
        this.setupSelectors();
        this.findAvailableVariant();
        if (this.options.length === 1) {
          this.singleSelector();
        }
        selectableOptions = this.$('.selector-wrapper select');
        for (_i = 0, _len = selectableOptions.length; _i < _len; _i++) {
          select = selectableOptions[_i];
          this.updateVariantLabel(null, select);
        }
      }
      if (Theme.imageZoom) {
        this.zoomView = new ZoomView({
          el: this.$('.product-big-image')
        });
      }
      if (Theme.currencySwitcher) {
        this.switchCurrency();
      }
      this.cacheImages();
      this.setupAssociation();
      return Shopify.onError = function(XMLHttpRequest) {
        return _this.handleErrors(XMLHttpRequest);
      };
    };

    ProductView.prototype.switchCurrency = function() {
      return $(document.body).trigger("reset-currency");
    };

    ProductView.prototype.associateImageVariant = function() {
      var newAlt, newImage, selectedOptionLabel,
        _this = this;
      if (this.hasAssociation) {
        selectedOptionLabel = this.$(".selector-wrapper label:contains(" + Theme.associateImagesOption + ")");
        newAlt = selectedOptionLabel.next().find('select').val();
        newImage = this.$(".product-thumbnails img[alt*='" + newAlt + "']").data('high-res');
        this.$(".product-thumbnails img").removeClass('in-selected-variant active');
        if (newImage) {
          this.$('.product-big-image img').attr('src', newImage).attr('alt', newAlt).removeClass('product-no-images');
          if (Theme.imageZoom) {
            this.$('.product-big-image').trigger('prepare-zoom');
          }
          this.$(".product-thumbnails img[alt*='" + newAlt + "']").addClass('in-selected-variant').first().addClass('active');
        } else {
          this.$('.product-big-image img').attr('src', this.noImageURL).addClass('product-no-images');
        }
        return this.$('.product-big-image').imagesLoaded(function() {
          _this.$('.product-big-image').removeClass('working').addClass('processed');
          return _this.$('.product-thumbnails').toggleClass('hidden', _this.$('.product-thumbnails img:visible').length <= 1);
        });
      }
    };

    ProductView.prototype.setupAssociation = function() {
      var availableOptions, image, imageAlt, option, selectID, _i, _len, _ref, _results;
      if (Theme.associateImages && Theme.associateImagesOption) {
        selectID = this.$(".selector-wrapper label:contains(" + Theme.associateImagesOption + ")").next().find('select').attr('id');
        if (selectID) {
          availableOptions = document.getElementById("" + selectID).options;
          this.hasAssociation = true;
          this.associateImageVariant();
          _ref = this.$('.product-thumbnails img');
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            image = _ref[_i];
            imageAlt = $(image).attr('alt');
            _results.push((function() {
              var _j, _len1, _results1;
              _results1 = [];
              for (_j = 0, _len1 = availableOptions.length; _j < _len1; _j++) {
                option = availableOptions[_j];
                if (imageAlt.indexOf(option.value) > -1) {
                  _results1.push($(image).addClass('hidden'));
                } else {
                  _results1.push(void 0);
                }
              }
              return _results1;
            })());
          }
          return _results;
        } else {
          return this.$('.product-big-image').removeClass('working').addClass('processed');
        }
      }
    };

    ProductView.prototype.cacheImages = function() {
      var bigImage, image, imageSRC, images, _i, _len;
      this.cacheImages.cache = [];
      images = this.$('.product-thumbnails img');
      for (_i = 0, _len = images.length; _i < _len; _i++) {
        image = images[_i];
        imageSRC = $(image).data('high-res');
        bigImage = new Image();
        bigImage.src = imageSRC;
        this.cacheImages.cache.push(bigImage);
      }
      bigImage = new Image();
      bigImage.src = this.noImageURL;
      return this.cacheImages.cache.push(bigImage);
    };

    ProductView.prototype.updateProductImage = function(e) {
      var newAlt, newSrc, target;
      this.$('.product-thumbnails img').removeClass('active');
      target = $(e.target);
      newSrc = target.data('high-res');
      newAlt = target.attr('alt');
      target.addClass('active');
      this.$('.product-big-image img').removeClass('product-no-images').attr('src', newSrc).attr('alt', newAlt);
      if (Theme.imageZoom) {
        return this.$('.product-big-image').trigger('prepare-zoom');
      }
    };

    ProductView.prototype.setupSelectors = function() {
      var selector, _i, _len, _ref, _results;
      new Shopify.OptionSelectors('product-select', {
        product: window.productJSON,
        onVariantSelected: this.selectCallback
      });
      _ref = this.$('.selector-wrapper');
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        selector = _ref[_i];
        _results.push($(selector).find('select').wrap('<div class="select-wrapper" />').parent().prepend('<div class="select-text" />'));
      }
      return _results;
    };

    ProductView.prototype.findAvailableVariant = function() {
      var i, option, variant, _i, _j, _len, _len1, _ref, _ref1;
      _ref = this.variants;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        variant = _ref[_i];
        if (variant.available) {
          _ref1 = variant.options;
          for (i = _j = 0, _len1 = _ref1.length; _j < _len1; i = ++_j) {
            option = _ref1[i];
            this.$(".single-option-selector:eq(" + i + ")").val(option).trigger('change');
          }
          return;
        }
      }
    };

    ProductView.prototype.singleSelector = function() {
      return this.$('.selector-wrapper').prepend("<label>" + this.options[0] + "</label>");
    };

    ProductView.prototype.selectCallback = function(variant, selector) {
      if (variant) {
        if (variant.available) {
          this.addToCartButton.val(Theme.addToCartText).removeClass('disabled').removeAttr('disabled');
        } else {
          this.addToCartButton.val(Theme.soldOutText).addClass('disabled').attr('disabled', 'disabled');
        }
        if (variant.compare_at_price > variant.price) {
          this.priceArea.find(".money:first-child").html(Shopify.formatMoney(variant.price, Theme.moneyFormat));
          this.priceArea.find(".original").html(Shopify.formatMoney(variant.compare_at_price, Theme.moneyFormat)).show();
        } else {
          this.priceArea.find(".money").html(Shopify.formatMoney(variant.price, Theme.moneyFormat));
          this.priceArea.find(".original").hide();
        }
      } else {
        this.addToCartButton.val(Theme.unavailableText).addClass('disabled').attr('disabled', 'disabled');
      }
      if (Theme.currencySwitcher) {
        return this.switchCurrency();
      }
    };

    ProductView.prototype.updateVariantLabel = function(e, select) {
      var label, renderedLabel, selectedVariant;
      select = e ? e.target : select;
      select = $(select);
      label = $(select).parents('.selector-wrapper').find('label').text();
      selectedVariant = select.find('option:selected').val();
      renderedLabel = "<strong>" + label + ":</strong>";
      return select.prev('.select-text').html("" + renderedLabel + " " + selectedVariant);
    };

    ProductView.prototype.addToCart = function(e) {
      var quantity, selectedVariant,
        _this = this;
      e.preventDefault();
      if (this.processing) {
        return;
      }
      this.processing = true;
      if (Modernizr.cssanimations) {
        this.$('.add-to-cart').addClass('loading');
      } else {
        this.addToCartButton.val(Theme.processingText);
      }
      selectedVariant = this.$('#product-select').length ? this.$('#product-select').val() : this.$('.product-select').val();
      quantity = this.$('input[name="quantity"]').val();
      if (quantity === '' || quantity === '0') {
        return setTimeout(function() {
          _this.$('input[name="quantity"]').addClass('error');
          _this.$('.product-add-error-message').text('Please enter a value for quantity.');
          _this.$('.add-to-cart').removeClass('loading added-success').addClass('added-error');
          return _this.processing = false;
        }, 500);
      } else {
        return Shopify.addItem(selectedVariant, quantity, function(cartItem) {
          return setTimeout(function() {
            if (theme.isHome) {
              window.location.href = "/checkout";
            } else {
              Shopify.getCart(function(cart) {
                return $('.cart-link .cart-count').text(cart.item_count);
              });
              _this.$('.added-product-name').text(cartItem.title);
              _this.$('input[name="quantity"]').removeClass('error');
              _this.$('.add-to-cart').removeClass('loading added-error').addClass('added-success');
              if (!Modernizr.cssanimations) {
                _this.addToCartButton.val(Theme.addToCartText);
              }
            }
            return _this.processing = false;
          }, 1000);
        });
      }
    };

    ProductView.prototype.handleErrors = function(errors) {
      var errorDescription, errorMessage, productTitle,
        _this = this;
      errorMessage = $.parseJSON(errors.responseText);
      productTitle = this.$('.page-title').text();
      errorDescription = errorMessage.description;
      if (errorMessage.description.indexOf(productTitle) > -1) {
        errorDescription = errorDescription.replace(productTitle, "<em>" + productTitle + "</em>");
      }
      if (errorMessage.message === 'Cart Error') {
        return setTimeout(function() {
          _this.$('input[name="quantity"]').removeClass('error');
          _this.$('.product-add-error-message').html(errorDescription);
          _this.$('.add-to-cart').removeClass('loading added-success').addClass('added-error');
          if (!Modernizr.cssanimations) {
            _this.addToCartButton.val(Theme.addToCartText);
          }
          return _this.processing = false;
        }, 1000);
      }
    };

    ProductView.prototype.render = function() {};

    return ProductView;

  })(Backbone.View);

}).call(this);
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) {
      for (var key in parent) {
        if (__hasProp.call(parent, key)) child[key] = parent[key];
      }

      function ctor() {
        this.constructor = child;
      }
      ctor.prototype = parent.prototype;
      child.prototype = new ctor();
      child.__super__ = parent.prototype;
      return child;
    };

  window.SlideshowView = (function(_super) {

    __extends(SlideshowView, _super);

    function SlideshowView() {
      return SlideshowView.__super__.constructor.apply(this, arguments);
    }

    SlideshowView.prototype.events = {
      'click .home-slideshow-previous': 'previousSlide',
      'click .home-slideshow-next': 'nextSlide',
      'click .home-slideshow-pagination > span': 'specificSlide',
      'mouseenter': 'pauseLoop',
      'mouseleave': 'startLoop'
    };

    SlideshowView.prototype.initialize = function() {
      this.openingScreen = this.$el.hasClass('opening-screen');
      this.slideNavigation = this.$('.home-slideshow-navigation');
      this.slidePagination = this.$('.home-slideshow-pagination');
      this.ltIE9 = $('html').hasClass('lt-ie9');
      this.setupSlides();
      return this.transitionend = (function(transition) {
        var transEndEventNames;
        transEndEventNames = {
          "-webkit-transition": "webkitTransitionEnd",
          "-moz-transition": "transitionend",
          "-o-transition": "oTransitionEnd",
          transition: "transitionend"
        };
        return transEndEventNames[transition];
      })(Modernizr.prefixed("transition"));
    };

    SlideshowView.prototype.setupSlides = function() {
      var paginationWidth, windowHeight, windowWidth,
        _this = this;
      this.slides = this.$('.home-slide');
      this.slideCount = this.slides.length;
      this.$('.home-slideshow-pagination span:first').addClass('active');
      if (this.ltIE9) {
        paginationWidth = this.slidePagination.width();
        this.slidePagination.css({
          marginLeft: -(paginationWidth / 2)
        });
      }
      windowWidth = window.innerWidth || document.documentElement.clientWidth;
      windowHeight = window.innerHeight || document.documentElement.clientHeight;
      return this.$el.imagesLoaded(function() {
        var i, image, imageHeight, slide, slideHeight, slideID, slideText, textHeight, textWidth, _i, _len, _ref;
        _ref = _this.slides;
        for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
          slide = _ref[i];
          slide = $(slide);
          slideID = slide.attr('id');
          if (_this.openingScreen && windowWidth > 720) {
            imageHeight = windowHeight;
            slide.height(imageHeight);
            if (_this.ltIE9) {
              slide.css('background-image', '').find('img').show().height(imageHeight);
            }
          } else {
            image = slide.find('.slide-image');
            imageHeight = image.height();
          }
          slide.data('height', imageHeight);
          slideHeight = windowWidth <= 720 ? slide.height() : imageHeight;
          if (_this.ltIE9) {
            slideText = slide.find('.slide-text');
            textHeight = slideText.height();
            slideText.css({
              marginTop: -(textHeight / 2)
            });
            if (slide.hasClass('text-aligned-center')) {
              textWidth = slideText.outerWidth();
              slideText.css({
                marginLeft: -(textWidth / 2)
              });
            }
          }
          if (i === 0) {
            slide.addClass('active');
            _this.$el.height(slideHeight);
            _this.slideNavigation.css({
              lineHeight: "" + imageHeight + "px"
            });
            _this.resetPaginationPosition(imageHeight);
            _this.$el.attr('id', "viewing-" + slideID);
          }
          if (i + 1 === _this.slideCount) {
            _this.$el.addClass('slides-ready');
          }
        }
        $(window).on('resize', function() {
          return _this.resetSlideHeights();
        });
        if (Theme.slideshowAutoplay) {
          return _this.startLoop();
        }
      });
    };

    SlideshowView.prototype.resetSlideHeights = function() {
      var image, imageHeight, slide, slideHeight, windowHeight, windowWidth, _i, _len, _ref, _results;
      windowWidth = window.innerWidth || document.documentElement.clientWidth;
      windowHeight = window.innerHeight || document.documentElement.clientHeight;
      _ref = this.slides;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        slide = _ref[_i];
        slide = $(slide);
        if (this.openingScreen && windowWidth > 720) {
          imageHeight = windowHeight;
          slide.height(imageHeight);
        } else {
          image = slide.find('.slide-image');
          imageHeight = image.height();
          slide.css('height', '');
        }
        slide.data('height', imageHeight);
        slideHeight = windowWidth <= 720 ? slide.height() : imageHeight;
        if (slide.hasClass('active')) {
          this.$el.height(slideHeight);
          this.slideNavigation.css({
            lineHeight: "" + imageHeight + "px"
          });
          _results.push(this.resetPaginationPosition(imageHeight));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    SlideshowView.prototype.resetPaginationPosition = function(height) {
      var windowWidth;
      windowWidth = window.innerWidth || document.documentElement.clientWidth;
      if (windowWidth <= 720) {
        return this.slidePagination.css({
          bottom: 'auto',
          top: height - 50
        });
      } else {
        return this.slidePagination.css({
          bottom: 0,
          top: 'auto'
        });
      }
    };

    SlideshowView.prototype.previousSlide = function(e) {
      if (this.sliding) {
        return;
      }
      this.showNewSlide('prev');
      return e.preventDefault();
    };

    SlideshowView.prototype.nextSlide = function(e) {
      if (this.sliding) {
        return;
      }
      this.showNewSlide('next');
      if (e) {
        return e.preventDefault();
      }
    };

    SlideshowView.prototype.specificSlide = function(e) {
      var nextSlideID;
      if (!$(e.currentTarget).hasClass('active')) {
        nextSlideID = $(e.currentTarget).data('slide-id');
        return this.showNewSlide('next', nextSlideID);
      }
    };

    SlideshowView.prototype.updateSlidePagination = function(index) {
      this.slidePagination.find('.active').removeClass('active');
      return this.slidePagination.find('> span').eq(index).addClass('active');
    };

    SlideshowView.prototype.showNewSlide = function(type, specificSlide) {
      var activeSlide, called, direction, fallback, imageHeight, nextSlide, slideHeight, slideID, windowWidth,
        _this = this;
      this.sliding = true;
      called = false;
      if (this.slides.length === 1) {
        this.sliding = false;
        return;
      }
      direction = type === 'next' ? 'left' : 'right';
      fallback = type === 'next' ? 'first' : 'last';
      activeSlide = this.$('.home-slideshow').find('.active');
      nextSlide = specificSlide ? this.$("#" + specificSlide) : activeSlide[type]();
      nextSlide = nextSlide.length ? nextSlide : this.slides[fallback]();
      nextSlide.addClass(type);
      nextSlide[0].offsetWidth;
      activeSlide.addClass(direction);
      nextSlide.addClass(direction);
      if ($('html').hasClass('lt-ie10')) {
        nextSlide.removeClass([type, direction].join(' ')).addClass('active');
        activeSlide.removeClass(['active', direction].join(' '));
        this.sliding = false;
      } else {
        nextSlide.one(this.transitionend, function() {
          called = true;
          nextSlide.removeClass([type, direction].join(' ')).addClass('active');
          activeSlide.removeClass(['active', direction].join(' '));
          return _this.sliding = false;
        });
        setTimeout(function() {
          if (!called) {
            return nextSlide.trigger(_this.transitionend);
          }
        }, 300);
      }
      imageHeight = nextSlide.data('height');
      this.updateSlidePagination(nextSlide.index());
      this.resetPaginationPosition(imageHeight);
      this.slideNavigation.css({
        lineHeight: "" + imageHeight + "px"
      });
      windowWidth = window.innerWidth || document.documentElement.clientWidth;
      slideHeight = windowWidth <= 720 ? nextSlide.height() : imageHeight;
      slideID = nextSlide.attr('id');
      this.$el.attr('id', "viewing-" + slideID);
      return this.$el.height(slideHeight);
    };

    SlideshowView.prototype.startLoop = function() {
      var delay,
        _this = this;
      if (Theme.slideshowAutoplay) {
        delay = Theme.slideshowAutoplayDelay * 1000;
        return this.autoplay = setInterval(function() {
          return _this.nextSlide();
        }, delay);
      }
    };

    SlideshowView.prototype.pauseLoop = function() {
      return clearInterval(this.autoplay);
    };

    SlideshowView.prototype.render = function() {};

    return SlideshowView;

  })(Backbone.View);

}).call(this);
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) {
      for (var key in parent) {
        if (__hasProp.call(parent, key)) child[key] = parent[key];
      }

      function ctor() {
        this.constructor = child;
      }
      ctor.prototype = parent.prototype;
      child.prototype = new ctor();
      child.__super__ = parent.prototype;
      return child;
    };

  window.HomeView = (function(_super) {

    __extends(HomeView, _super);

    function HomeView() {
      return HomeView.__super__.constructor.apply(this, arguments);
    }

    HomeView.prototype.events = {};

    HomeView.prototype.initialize = function() {
      var videos;
      if (Theme.orderNow) {
        this.productView = new ProductView({
          el: this.$('.home-order-now')
        });
      }
      videos = this.$('.home-left-right-video, .home-full-width-video');
      videos.fitVids();
      if (this.$('.home-slideshow-wrapper').length) {
        this.slideshowView = new SlideshowView({
          el: this.$('.home-slideshow-wrapper')
        });
      }
      if ($(document.body).hasClass('template-index')) {
        return this.headerBorderCheck();
      }
    };

    HomeView.prototype.headerBorderCheck = function() {
      var bodyBackground, headerBackground;
      if (Theme.headerSticky || this.$('.home-slideshow-wrapper').length || this.$('.home-hero').length) {
        return;
      }
      if ($(document.body).css('background-image') === !'none') {
        return;
      }
      headerBackground = $('.main-header-wrapper').css('background-color');
      bodyBackground = $(document.body).css('background-color');
      if (this.$('.home-module-wrapper:first-child').hasClass('default') && headerBackground === bodyBackground) {
        return $('.main-header-wrapper').addClass('show-border');
      }
    };

    HomeView.prototype.render = function() {};

    return HomeView;

  })(Backbone.View);

}).call(this);
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) {
      for (var key in parent) {
        if (__hasProp.call(parent, key)) child[key] = parent[key];
      }

      function ctor() {
        this.constructor = child;
      }
      ctor.prototype = parent.prototype;
      child.prototype = new ctor();
      child.__super__ = parent.prototype;
      return child;
    };

  window.CollectionView = (function(_super) {

    __extends(CollectionView, _super);

    function CollectionView() {
      return CollectionView.__super__.constructor.apply(this, arguments);
    }

    CollectionView.prototype.events = {
      'change .collection-tag-selector select': 'browseByTag'
    };

    CollectionView.prototype.initialize = function() {};

    CollectionView.prototype.browseByTag = function(e) {
      var fallback, newTag, select;
      select = $(e.target);
      fallback = select.data('fallback-url');
      newTag = select.find(':selected').attr('name');
      if (newTag === 'reset') {
        return window.location.href = fallback;
      } else {
        return window.location.href = "" + fallback + "/" + newTag;
      }
    };

    CollectionView.prototype.render = function() {};

    return CollectionView;

  })(Backbone.View);

}).call(this);
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) {
      for (var key in parent) {
        if (__hasProp.call(parent, key)) child[key] = parent[key];
      }

      function ctor() {
        this.constructor = child;
      }
      ctor.prototype = parent.prototype;
      child.prototype = new ctor();
      child.__super__ = parent.prototype;
      return child;
    };

  window.ListCollectionsView = (function(_super) {

    __extends(ListCollectionsView, _super);

    function ListCollectionsView() {
      return ListCollectionsView.__super__.constructor.apply(this, arguments);
    }

    ListCollectionsView.prototype.events = {};

    ListCollectionsView.prototype.initialize = function() {
      var collection, collectionDetails, collections, _i, _len, _results;
      if ($('html').hasClass('lt-ie9')) {
        collections = this.$('.collection-list-item');
        _results = [];
        for (_i = 0, _len = collections.length; _i < _len; _i++) {
          collection = collections[_i];
          collectionDetails = $(collection).find('.collection-details');
          _results.push(this.verticallyAlignText(collectionDetails));
        }
        return _results;
      }
    };

    ListCollectionsView.prototype.verticallyAlignText = function(collectionDetails) {
      var textHeight;
      textHeight = collectionDetails.height();
      return collectionDetails.css({
        marginTop: -(textHeight / 2)
      });
    };

    ListCollectionsView.prototype.render = function() {};

    return ListCollectionsView;

  })(Backbone.View);

}).call(this);
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) {
      for (var key in parent) {
        if (__hasProp.call(parent, key)) child[key] = parent[key];
      }

      function ctor() {
        this.constructor = child;
      }
      ctor.prototype = parent.prototype;
      child.prototype = new ctor();
      child.__super__ = parent.prototype;
      return child;
    };

  window.CartView = (function(_super) {

    __extends(CartView, _super);

    function CartView() {
      return CartView.__super__.constructor.apply(this, arguments);
    }

    CartView.prototype.events = {
      'click .cart-item-decrease': 'updateQuantity',
      'click .cart-item-increase': 'updateQuantity',
      'click .cart-item-remove': 'removeProduct',
      'click .cart-undo': 'undoRemoval',
      'change .cart-instructions textarea': 'saveSpecialInstructions',
      'click .dismiss': 'closeModal'
    };

    CartView.prototype.initialize = function() {
      this.transitionend = (function(transition) {
        var transEndEventNames;
        transEndEventNames = {
          "-webkit-transition": "webkitTransitionEnd",
          "-moz-transition": "transitionend",
          "-o-transition": "oTransitionEnd",
          transition: "transitionend"
        };
        return transEndEventNames[transition];
      })(Modernizr.prefixed("transition"));
      this.modalWrapper = this.$('.cart-modal-wrapper');
      this.modalTitle = this.$('.cart-modal h3');
      this.modalMessage = this.$('.cart-modal-message');
      this.modalAction = this.$('.cart-modal-action');
      this.savedProducts = [];
      if (Theme.shippingCalculator && this.$('.cart-items').length) {
        return this.shippingCalculator();
      }
    };

    CartView.prototype.saveSpecialInstructions = function() {
      var newNote;
      newNote = $('.cart-instructions textarea').val();
      return Shopify.updateCartNote(newNote, function(cart) {});
    };

    CartView.prototype.updateQuantity = function(e) {
      var action, inventory, message, newQuantity, oldQuantity, productPrice, productQuantity, productRow, productTitle, title, variant,
        _this = this;
      productRow = $(e.target).parents('tr');
      productTitle = productRow.find('.cart-title').text();
      productPrice = productRow.find('td.cart-item-total .money');
      productQuantity = productRow.find('.cart-item-quantity-display');
      variant = productRow.data('variant');
      inventory = parseInt(productRow.find('.cart-item-quantity').data('max'), 10);
      oldQuantity = parseInt(productQuantity.text());
      if ($(e.target).hasClass('cart-item-increase')) {
        newQuantity = oldQuantity + 1;
      } else {
        newQuantity = oldQuantity - 1;
      }
      if (newQuantity === 0) {
        this.removeProduct(null, variant);
        return;
      }
      if (newQuantity > inventory) {
        title = "Not Available";
        message = "Sorry, we only have " + inventory + " in stock.";
        action = "<span class='button dismiss'>Okay</span>";
        return this.openModal(title, message, action);
      }
      return Shopify.changeItem(variant, newQuantity, function(cart) {
        var item, newProductPrice, _i, _len, _ref;
        _ref = cart.items;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          item = _ref[_i];
          if (item.id === variant) {
            newProductPrice = Shopify.formatMoney(item.line_price, Theme.moneyFormat);
            productPrice.html(newProductPrice);
            productRow.find('.cart-item-quantity-display').text(item.quantity);
          }
        }
        return _this.updateCart(cart);
      });
    };

    CartView.prototype.removeProduct = function(e, variant) {
      var itemRow, itemRowContents, productTitle, productURL, swapProductText,
        _this = this;
      if (variant) {
        itemRow = $(".variant-" + variant);
      } else {
        variant = $(e.target).parents('tr').data('variant');
        itemRow = $(e.target).parents('tr');
      }
      itemRowContents = itemRow.find('td');
      productTitle = itemRow.data('title');
      productURL = itemRow.data('url');
      this.savedProducts[variant] = {
        'id': variant,
        'content': itemRowContents,
        'quantity': itemRow.find('.cart-item-quantity-display').text()
      };
      swapProductText = function() {
        itemRow.html("<td class='cart-item-undo' colspan='5'><a href='" + productURL + "'>" + productTitle + "</a> has been removed from your cart. <span class='cart-undo' data-variant='" + variant + "'>Undo?</span>");
        return itemRow.removeClass('removing');
      };
      return Shopify.removeItem(variant, function(cart) {
        if (Modernizr.csstransitions) {
          itemRow.addClass('removing').one(_this.transitionend, function() {
            return swapProductText();
          });
        } else {
          swapProductText();
        }
        return _this.updateCart(cart);
      });
    };

    CartView.prototype.undoRemoval = function(e) {
      var savedProduct, variant,
        _this = this;
      variant = $(e.target).data('variant');
      savedProduct = this.savedProducts[variant];
      $("tr.variant-" + variant).html(savedProduct.content);
      return Shopify.addItem(variant, savedProduct.quantity, function() {
        return Shopify.getCart(function(cart) {
          return _this.updateCart(cart);
        });
      });
    };

    CartView.prototype.updateCart = function(cart) {
      var cartCount, cartCountText, newTotal;
      newTotal = Shopify.formatMoney(cart.total_price, Theme.moneyFormat);
      $('.cart-totals .cart-price .money').text(newTotal);
      if (Theme.currencySwitcher) {
        $(document.body).trigger("reset-currency");
      }
      cartCount = cart.item_count;
      cartCountText = cart.item_count === 1 ? 'item' : 'items';
      return $('.cart-count').text("" + cartCount + " " + cartCountText);
    };

    CartView.prototype.shippingCalculator = function() {
      var selectableOptions,
        _this = this;
      Shopify.Cart.ShippingCalculator.show({
        submitButton: Theme.shippingButton,
        submitButtonDisabled: Theme.shippingButton,
        customerIsLoggedIn: Theme.customerLoggedIn,
        moneyFormat: Theme.moneyFormat
      });
      selectableOptions = this.$('.cart-shipping-calculator select');
      setTimeout(function() {
        var select, _i, _len, _results;
        _results = [];
        for (_i = 0, _len = selectableOptions.length; _i < _len; _i++) {
          select = selectableOptions[_i];
          _results.push(_this.updateShippingLabel(select));
        }
        return _results;
      }, 500);
      return this.$('.cart-shipping-calculator select').change(function(e) {
        var select, _i, _len, _results;
        _results = [];
        for (_i = 0, _len = selectableOptions.length; _i < _len; _i++) {
          select = selectableOptions[_i];
          _results.push(_this.updateShippingLabel(select));
        }
        return _results;
      });
    };

    CartView.prototype.updateShippingLabel = function(select) {
      var selectedOption,
        _this = this;
      if (select) {
        select = $(select);
        selectedOption = select.find('option:selected').val();
        if (!selectedOption) {
          selectedOption = select.prev('.selected-text').data('default');
        }
        select.prev('.selected-text').text(selectedOption);
        return setTimeout(function() {
          if (select.attr('name') === 'address[country]') {
            return _this.updateShippingLabel(_this.$('#address_province'));
          }
        }, 500);
      }
    };

    CartView.prototype.openModal = function(title, message, action) {
      this.modalTitle.text(title);
      this.modalMessage.text(message);
      this.modalAction.html(action);
      return this.modalWrapper.addClass('active');
    };

    CartView.prototype.closeModal = function() {
      return this.modalWrapper.removeClass('active');
    };

    CartView.prototype.render = function() {};

    return CartView;

  })(Backbone.View);

}).call(this);
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) {
      for (var key in parent) {
        if (__hasProp.call(parent, key)) child[key] = parent[key];
      }

      function ctor() {
        this.constructor = child;
      }
      ctor.prototype = parent.prototype;
      child.prototype = new ctor();
      child.__super__ = parent.prototype;
      return child;
    };

  window.PostView = (function(_super) {

    __extends(PostView, _super);

    function PostView() {
      return PostView.__super__.constructor.apply(this, arguments);
    }

    PostView.prototype.events = {};

    PostView.prototype.initialize = function() {
      var highlight, _i, _len, _ref,
        _this = this;
      this.setFeaturedImage();
      this.artDirection();
      this.wrapAllNodes();
      _ref = this.$('.highlight');
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        highlight = _ref[_i];
        this.fixOverlappingElements($(highlight));
      }
      return $(window).resize(function() {
        var _j, _len1, _ref1, _results;
        _this.setFeaturedImage(true);
        if (window.innerWidth > 1020) {
          _ref1 = _this.$('.highlight');
          _results = [];
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            highlight = _ref1[_j];
            _results.push(_this.fixOverlappingElements($(highlight)));
          }
          return _results;
        }
      });
    };

    PostView.prototype.wrapAllNodes = function() {
      var childNodes, node, _i, _len, _results;
      childNodes = this.$('.rte')[0].childNodes;
      _results = [];
      for (_i = 0, _len = childNodes.length; _i < _len; _i++) {
        node = childNodes[_i];
        if (node.nodeType === 3 && node.textContent.replace(/^\s+|\s+$/g, "")) {
          _results.push($(node).replaceWith("<p>" + node.textContent + "</p>"));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    PostView.prototype.fixOverlappingElements = function(highlight) {
      if (this.$('.post-meta').overlaps(highlight).length) {
        highlight.addClass('overlapping');
      }
      return highlight.addClass('processed');
    };

    PostView.prototype.setFeaturedImage = function(resize) {
      var contentWidth, featuredImage, parent, windowWidth;
      featuredImage = this.$('.featured-image');
      if (featuredImage.length) {
        parent = featuredImage.parent();
        windowWidth = $(window).width();
        contentWidth = this.$('.post-content').width();
        if (resize) {
          featuredImage.css({
            width: windowWidth,
            marginLeft: -(windowWidth - contentWidth) / 2
          });
          return;
        }
        featuredImage.detach().insertAfter('.page-title').css({
          width: windowWidth,
          marginLeft: -(windowWidth - contentWidth) / 2
        }).addClass('processed');
        if (parent.is(':empty')) {
          return parent.remove();
        }
      }
    };

    PostView.prototype.artDirection = function() {
      var images,
        _this = this;
      images = this.$('.post-content').find('img');
      return images.imagesLoaded(function() {
        var direction, image, imageAlt, imageParent, imageWidth, marginLeft, marginRight, _i, _len, _results;
        _results = [];
        for (_i = 0, _len = images.length; _i < _len; _i++) {
          image = images[_i];
          image = $(image);
          if (image.parent().hasClass('post-content')) {
            image.wrap('<div />');
          }
          imageParent = image.parent();
          if (image.css('float') !== 'none') {
            direction = image.css('float');
            imageParent.addClass("highlight highlight-" + direction);
            _this.fixOverlappingElements(imageParent);
          }
          imageWidth = image.width();
          imageAlt = image.attr('alt');
          if (imageAlt && imageAlt.length && imageParent.not('img')) {
            marginLeft = image.css('margin-left');
            marginRight = image.css('margin-right');
            _results.push(imageParent.append("<div style='max-width: " + imageWidth + "px; margin-left: " + marginLeft + "; margin-right: " + marginRight + ";' class='photo-caption meta'>" + imageAlt + "</div>"));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      });
    };

    return PostView;

  })(Backbone.View);

}).call(this);
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) {
      for (var key in parent) {
        if (__hasProp.call(parent, key)) child[key] = parent[key];
      }

      function ctor() {
        this.constructor = child;
      }
      ctor.prototype = parent.prototype;
      child.prototype = new ctor();
      child.__super__ = parent.prototype;
      return child;
    };

  window.BlogView = (function(_super) {

    __extends(BlogView, _super);

    function BlogView() {
      return BlogView.__super__.constructor.apply(this, arguments);
    }

    BlogView.prototype.events = {};

    BlogView.prototype.initialize = function() {
      var post, _i, _len, _ref, _results;
      _ref = this.$('.blog-post');
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        post = _ref[_i];
        _results.push(new PostView({
          el: post
        }));
      }
      return _results;
    };

    BlogView.prototype.render = function() {};

    return BlogView;

  })(Backbone.View);

}).call(this);
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) {
      for (var key in parent) {
        if (__hasProp.call(parent, key)) child[key] = parent[key];
      }

      function ctor() {
        this.constructor = child;
      }
      ctor.prototype = parent.prototype;
      child.prototype = new ctor();
      child.__super__ = parent.prototype;
      return child;
    };

  window.AddressesView = (function(_super) {

    __extends(AddressesView, _super);

    function AddressesView() {
      return AddressesView.__super__.constructor.apply(this, arguments);
    }

    AddressesView.prototype.events = {
      'click .delete-address': 'deleteAddress',
      'click .edit-address': 'editAddress',
      'click .cancel-edit': 'cancelEditing',
      'click .toggle-new-address': 'toggleNewAddress',
      'change .select-wrapper select': 'updateSelectedText'
    };

    AddressesView.prototype.initialize = function() {
      return this.prepareAddresses();
    };

    AddressesView.prototype.prepareAddresses = function() {
      var address, addressID, addresses, select, selectableOptions, _i, _j, _len, _len1, _results;
      new Shopify.CountryProvinceSelector('address-country', 'address-province', {
        hideElement: 'address-province-container'
      });
      addresses = this.$('.customer-address');
      if (addresses.length) {
        for (_i = 0, _len = addresses.length; _i < _len; _i++) {
          address = addresses[_i];
          addressID = $(address).data('address-id');
          new Shopify.CountryProvinceSelector("address-country-" + addressID, "address-province-" + addressID, {
            hideElement: "address-province-container-" + addressID
          });
        }
      }
      selectableOptions = this.$('.select-wrapper select');
      _results = [];
      for (_j = 0, _len1 = selectableOptions.length; _j < _len1; _j++) {
        select = selectableOptions[_j];
        _results.push(this.updateSelectedText(null, select));
      }
      return _results;
    };

    AddressesView.prototype.updateSelectedText = function(e, select) {
      var addressID, selectedValue;
      select = e ? $(e.target) : $(select);
      selectedValue = select.find('option:selected').text();
      if (selectedValue !== '') {
        select.prev('.selected-text').text(selectedValue);
      }
      if (select.attr('name') === 'address[country]') {
        addressID = $(select).attr('id').split('address-country-')[1];
        addressID = addressID ? "#address-province-" + addressID : '.new-address-province';
        return this.updateSelectedText(null, $(addressID));
      }
    };

    AddressesView.prototype.deleteAddress = function(e) {
      var addressID;
      addressID = $(e.target).parents('[data-address-id]').data('address-id');
      return Shopify.CustomerAddress.destroy(addressID);
    };

    AddressesView.prototype.editAddress = function(e) {
      var addressID;
      addressID = $(e.target).parents('[data-address-id]').data('address-id');
      $(".customer-address[data-address-id='" + addressID + "']").addClass('editing');
      return $(".customer-address-edit-form[data-address-id='" + addressID + "']").addClass('show');
    };

    AddressesView.prototype.cancelEditing = function(e) {
      var addressID;
      addressID = $(e.target).parents('[data-address-id]').data('address-id');
      $(".customer-address[data-address-id='" + addressID + "']").removeClass('editing');
      return $(".customer-address-edit-form[data-address-id='" + addressID + "']").removeClass('show');
    };

    AddressesView.prototype.toggleNewAddress = function() {
      this.$('.add-new-address').toggle();
      return this.$('.customer-new-address').toggleClass('show');
    };

    AddressesView.prototype.render = function() {};

    return AddressesView;

  })(Backbone.View);

}).call(this);
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) {
      for (var key in parent) {
        if (__hasProp.call(parent, key)) child[key] = parent[key];
      }

      function ctor() {
        this.constructor = child;
      }
      ctor.prototype = parent.prototype;
      child.prototype = new ctor();
      child.__super__ = parent.prototype;
      return child;
    };

  window.AccountView = (function(_super) {

    __extends(AccountView, _super);

    function AccountView() {
      return AccountView.__super__.constructor.apply(this, arguments);
    }

    AccountView.prototype.events = {
      'click .toggle-forgetfulness span': 'recoverPassword'
    };

    AccountView.prototype.initialize = function() {
      var _this = this;
      if ($(document.body).hasClass('template-customers-addresses')) {
        this.addressesView = new AddressesView({
          el: $('.main-content')
        });
      }
      if ($(document.body).hasClass('template-customers-login')) {
        this.checkForReset();
      }
      if (window.location.hash === '#recover') {
        this.recoverPassword();
      }
      this.mobilifyTables();
      return $(window).resize(function() {
        return _this.mobilifyTables();
      });
    };

    AccountView.prototype.recoverPassword = function() {
      this.$('.recover-password').toggle();
      return this.$('.customer-login').toggle();
    };

    AccountView.prototype.checkForReset = function() {
      if ($('.reset-check').data('successful-reset') === true) {
        return $('.successful-reset').show();
      }
    };

    AccountView.prototype.mobilifyTables = function() {
      return this.$('.orders').mobileTable();
    };

    AccountView.prototype.render = function() {};

    return AccountView;

  })(Backbone.View);

}).call(this);
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) {
      for (var key in parent) {
        if (__hasProp.call(parent, key)) child[key] = parent[key];
      }

      function ctor() {
        this.constructor = child;
      }
      ctor.prototype = parent.prototype;
      child.prototype = new ctor();
      child.__super__ = parent.prototype;
      return child;
    };

  window.RTEView = (function(_super) {

    __extends(RTEView, _super);

    function RTEView() {
      return RTEView.__super__.constructor.apply(this, arguments);
    }

    RTEView.prototype.events = {
      'click .rte .tabs li': 'switchTabs',
      'change .select-wrapper select': 'updateOption'
    };

    RTEView.prototype.initialize = function() {
      var select, selects, _i, _len,
        _this = this;
      this.setupTabs();
      selects = this.$el.find('select');
      for (_i = 0, _len = selects.length; _i < _len; _i++) {
        select = selects[_i];
        if (!$(select).parent('.select-wrapper').length) {
          $(select).wrap('<div class="select-wrapper" />').parent().prepend('<span class="selected-text"></span>');
        }
        this.updateOption(null, select);
      }
      this.$el.fitVids();
      this.mobilifyTables();
      return $(window).resize(function() {
        return _this.mobilifyTables();
      });
    };

    RTEView.prototype.switchTabs = function(e) {
      var content, position, tab, tabContainer, tabContentContainer;
      tab = $(e.currentTarget);
      tabContainer = tab.parent();
      tabContentContainer = tabContainer.next();
      position = tab.index();
      content = tabContentContainer.find('li').eq(position);
      tabContainer.find('> li').removeClass('active');
      tabContentContainer.find('> li').removeClass('active');
      tab.addClass('active');
      return content.addClass('active');
    };

    RTEView.prototype.setupTabs = function() {
      var tabs;
      tabs = this.$el.find('.tabs');
      tabs.find('li:first').addClass('active');
      return tabs.next().find('li:first').addClass('active');
    };

    RTEView.prototype.updateOption = function(e, selector) {
      var newOption, select;
      select = e ? $(e.target) : $(selector);
      newOption = select.find('option:selected').text();
      return select.siblings('.selected-text').text(newOption);
    };

    RTEView.prototype.mobilifyTables = function() {
      return this.$el.find('table').mobileTable();
    };

    return RTEView;

  })(Backbone.View);

}).call(this);
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) {
      for (var key in parent) {
        if (__hasProp.call(parent, key)) child[key] = parent[key];
      }

      function ctor() {
        this.constructor = child;
      }
      ctor.prototype = parent.prototype;
      child.prototype = new ctor();
      child.__super__ = parent.prototype;
      return child;
    };

  window.FooterView = (function(_super) {

    __extends(FooterView, _super);

    function FooterView() {
      return FooterView.__super__.constructor.apply(this, arguments);
    }

    FooterView.prototype.events = {};

    FooterView.prototype.initialize = function() {};

    FooterView.prototype.render = function() {};

    return FooterView;

  })(Backbone.View);

}).call(this);
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) {
      for (var key in parent) {
        if (__hasProp.call(parent, key)) child[key] = parent[key];
      }

      function ctor() {
        this.constructor = child;
      }
      ctor.prototype = parent.prototype;
      child.prototype = new ctor();
      child.__super__ = parent.prototype;
      return child;
    };

  window.NotFoundView = (function(_super) {

    __extends(NotFoundView, _super);

    function NotFoundView() {
      return NotFoundView.__super__.constructor.apply(this, arguments);
    }

    NotFoundView.prototype.events = {};

    NotFoundView.prototype.initialize = function() {};

    NotFoundView.prototype.render = function() {};

    return NotFoundView;

  })(Backbone.View);

}).call(this);
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) {
      for (var key in parent) {
        if (__hasProp.call(parent, key)) child[key] = parent[key];
      }

      function ctor() {
        this.constructor = child;
      }
      ctor.prototype = parent.prototype;
      child.prototype = new ctor();
      child.__super__ = parent.prototype;
      return child;
    };

  window.CurrencyView = (function(_super) {

    __extends(CurrencyView, _super);

    function CurrencyView() {
      return CurrencyView.__super__.constructor.apply(this, arguments);
    }

    CurrencyView.prototype.events = {
      'change [name=currencies]': 'convertAll',
      'switch-currency': 'switchCurrency',
      'reset-currency': 'resetCurrency'
    };

    CurrencyView.prototype.initialize = function() {
      var doubleMoney, money, _i, _j, _len, _len1, _ref, _ref1;
      Currency.format = Theme.currencySwitcherFormat;
      Currency.money_with_currency_format[Theme.currency] = Theme.moneyFormatCurrency;
      Currency.money_format[Theme.currency] = Theme.moneyFormat;
      this.defaultCurrency = Theme.defaultCurrency || Theme.currency;
      this.cookieCurrency = Currency.cookie.read();
      if (this.cookieCurrency) {
        this.$("[name=currencies]").val(this.cookieCurrency);
      }
      _ref = this.$('span.money span.money');
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        doubleMoney = _ref[_i];
        $(doubleMoney).parents('span.money').removeClass('money');
      }
      _ref1 = this.$('span.money');
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        money = _ref1[_j];
        $(money).attr("data-currency-" + Theme.currency, $(money).html());
      }
      this.switchCurrency();
      return this.$('.selected-currency').text(Currency.currentCurrency);
    };

    CurrencyView.prototype.resetCurrency = function() {
      var attribute, money, _i, _j, _len, _len1, _ref, _ref1;
      _ref = this.$('span.money');
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        money = _ref[_i];
        _ref1 = $(money)[0].attributes;
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          attribute = _ref1[_j];
          if (attribute.name.indexOf('data-') > -1) {
            $(money).attr(attribute.name, '');
          }
        }
      }
      return this.switchCurrency();
    };

    CurrencyView.prototype.switchCurrency = function() {
      if (this.cookieCurrency === null) {
        if (Theme.currency === !this.defaultCurrency) {
          return Currency.convertAll(Theme.currency, this.defaultCurrency);
        } else {
          return Currency.currentCurrency = this.defaultCurrency;
        }
      } else if (this.$('[name=currencies]').size() && this.$('[name=currencies] option[value=' + this.cookieCurrency + ']').size() === 0) {
        Currency.currentCurrency = Theme.currency;
        return Currency.cookie.write(Theme.currency);
      } else if (this.cookieCurrency === Theme.currency) {
        return Currency.currentCurrency = Theme.currency;
      } else {
        return Currency.convertAll(Theme.currency, this.cookieCurrency);
      }
    };

    CurrencyView.prototype.convertAll = function(e, variant, selector) {
      var newCurrency;
      newCurrency = $(e.target).val();
      Currency.convertAll(Currency.currentCurrency, newCurrency);
      this.$('.selected-currency').text(Currency.currentCurrency);
      return this.cookieCurrency = newCurrency;
    };

    return CurrencyView;

  })(Backbone.View);

}).call(this);
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) {
      for (var key in parent) {
        if (__hasProp.call(parent, key)) child[key] = parent[key];
      }

      function ctor() {
        this.constructor = child;
      }
      ctor.prototype = parent.prototype;
      child.prototype = new ctor();
      child.__super__ = parent.prototype;
      return child;
    };

  window.ThemeView = (function(_super) {

    __extends(ThemeView, _super);

    function ThemeView() {
      return ThemeView.__super__.constructor.apply(this, arguments);
    }

    ThemeView.prototype.el = document.body;

    ThemeView.prototype.initialize = function() {
      var body;
      body = $(document.body);
      this.isHome = body.hasClass('template-index');
      this.isCollection = body.hasClass('template-collection');
      this.isListCollections = body.hasClass('template-list-collections');
      this.isProduct = body.hasClass('template-product');
      this.isCart = body.hasClass('template-cart');
      this.isPage = body.hasClass('template-page');
      this.isBlog = body.hasClass('template-blog') || body.hasClass('template-article');
      this.isAccount = body.attr('class').indexOf('-customers-') > 0;
      return this.is404 = body.hasClass('template-404');
    };

    ThemeView.prototype.render = function() {
      var rte, _i, _len, _ref;
      this.headerView = new HeaderView({
        el: $('.main-header-wrapper'),
        drawer: $('.header-drawer')
      });
      this.headerView.render();
      this.footerView = new FooterView({
        el: $('footer')
      });
      this.footerView.render();
      _ref = $('.rte');
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        rte = _ref[_i];
        this.rteView = new RTEView({
          el: rte
        });
      }
      if (this.isHome) {
        this.homeView = new HomeView({
          el: this.$el
        });
        this.homeView.render();
      }
      if (this.isCollection) {
        this.collectionView = new CollectionView({
          el: this.$el
        });
        this.collectionView.render();
      }
      if (this.isListCollections) {
        this.listCollectionsView = new ListCollectionsView({
          el: $('.collections-list')
        });
        this.listCollectionsView.render();
      }
      if (this.isProduct) {
        this.productView = new ProductView({
          el: this.$el
        });
        this.productView.render();
      }
      if (this.isCart) {
        this.cartView = new CartView({
          el: this.$el
        });
        this.cartView.render();
      }
      if (this.isBlog) {
        this.blogView = new BlogView({
          el: this.$el
        });
        this.blogView.render();
      }
      if (this.isAccount) {
        this.accountView = new AccountView({
          el: this.$el
        });
        this.accountView.render();
      }
      if (this.is404) {
        this.notFoundView = new NotFoundView({
          el: this.$el
        });
        this.notFoundView.render();
      }
      if (Theme.currencySwitcher) {
        this.currencyView = new CurrencyView({
          el: this.$el
        });
      }
      if ($('html').hasClass('lt-ie10')) {
        return this.inputPlaceholderFix();
      }
    };

    ThemeView.prototype.inputPlaceholderFix = function() {
      var input, placeholders, text, _i, _len;
      placeholders = $('[placeholder]');
      for (_i = 0, _len = placeholders.length; _i < _len; _i++) {
        input = placeholders[_i];
        input = $(input);
        if (!(input.val().length > 0)) {
          text = input.attr('placeholder');
          input.attr('value', text);
          input.data('original-text', text);
        }
      }
      placeholders.focus(function() {
        input = $(this);
        if (input.val() === input.data('original-text')) {
          return input.val('');
        }
      });
      return placeholders.blur(function() {
        input = $(this);
        if (input.val().length === 0) {
          return input.val(input.data('original-text'));
        }
      });
    };

    return ThemeView;

  })(Backbone.View);

}).call(this);
(function() {

  $(function() {
    window.theme = new ThemeView();
    return theme.render();
  });

}).call(this);
