$(function() {

  var selectCallback = function(variant, selector) {

    var $add = $('#add'),
      $addText = $('#addText'),
      $backorder = $('#backorder'),
      $price = $('#product-price'),
      $featuredImage = $('#productPhotoImg');

    if (variant) {

      // Update variant image, if one is set
      // Call standard.switchImage function in shop.js
      if (variant.featured_image) {
        var newImg = variant.featured_image,
          el = $featuredImage[0];
        Shopify.Image.switchImage(newImg, el, standard.switchImage);
      }

      if (variant.available) {

        // Selected a valid variant that is available
        $addText.text('Add to Cart');
        $add.removeClass('disabled').removeAttr('disabled').fadeTo(200, 1);

        // If item is back ordered yet can still be ordered, we'll show special message
        if (variant.inventory_management && variant.inventory_quantity <= 0) {
          $('#selected-variant').html({
            {
              product.title | json
            }
          } { % unless hide_default_title %
          } + ' - ' + variant.title { % endunless %
          });
          $backorder.removeClass('hidden').fadeTo(200, 1);
        } else {
          $backorder.fadeTo(200, 0).addClass('hidden');
        }

      } else {
        // Variant is sold out
        $backorder.fadeTo(200, 0).addClass('hidden');
        $addText.text('Sold Out');
        $add.addClass('disabled').attr('disabled', 'disabled').fadeTo(200, 0.5);
      }

      // Whether the variant is in stock or not, we can update the price and compare at price
      if (variant.compare_at_price > variant.price) {
        // Update price field
        $price.html('<span class="product-price on-sale">' + Shopify.formatMoney(variant.price, "{{ shop.money_format }}") + '</span>' +
          '&nbsp;<span class="product-compare-price">' + Shopify.formatMoney(variant.compare_at_price, "{{ shop.money_format }}") + '</span>');
      } else {
        // Update price field
        $price.html('<span class="product-price">' + Shopify.formatMoney(variant.price, "{{ shop.money_format }}") + '</span>');
      }

      { % if settings.show_multiple_currencies and shop.money_format contains 'money' %
      }
      Currency.convertAll(shopCurrency, $('[name=currencies]').val(), 'form[action="/cart/add"] span.money'); { % endif %
      }

    } else {
      // variant doesn't exist
      $backorder.fadeTo(200, 0).addClass('hidden');
      $addText.text('Unavailable');
      $add.addClass('disabled').attr('disabled', 'disabled').fadeTo(200, 0.5);
    }

  };

  new Shopify.OptionSelectors('product-select', {
    product: {
      {
        product | json
      }
    },
    onVariantSelected: selectCallback,
    enableHistoryState: true
  });

  // Add label if only one product option and it isn't 'Title'
  { %
    if product.options.size == 1 and product.options.first != 'Title' %
  }
  $('.selector-wrapper:eq(0)').prepend('<label>{{ product.options.first | escape }}</label>'); { % endif %
  }

});

Shopify.Image.preload({
  {
    product.images | json
  }
}, 'grande');
Shopify.Image.preload({
  {
    product.images | json
  }
}, '1024x1024');
