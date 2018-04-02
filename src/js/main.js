document.addEventListener('DOMContentLoaded', function(){

  ////////////////
  // MODALS
  ///////////////

  // show modal
  [].forEach.call(document.querySelectorAll("[js-snapwdg2-modal]"), function(el){
    el.addEventListener('click', function(e) {
      var target = el.getAttribute('href');
      showModal(target);
    });
  });

  // close
  [].forEach.call(document.querySelectorAll("[js-snapwdg2-close-modal]"), function(el){
    el.addEventListener('click', function(e) {
      var targetModal = e.target.closest('.snapwdg2-modal');
      hideModal( "#" + targetModal.getAttribute('id') );
    })
  })

  // close if click outside wrapper
  document.addEventListener('click', function(e){
    if ( !e.target.closest('.snapwdg2-modal__wrapper') ){
      var targetModal = e.target.closest('.snapwdg2-modal');
      if (targetModal){
        hideModal( "#" + targetModal.getAttribute('id') );
      }
    }
  })

  function showModal(id){
    // hide prev before
    [].forEach.call(document.querySelectorAll(".snapwdg2-modal"), function(modal){
      modal.classList.remove('is-active');
    })

    document.querySelector(id).classList.add('is-active');
    document.querySelector('.snapwdg2-modal-bg').classList.add('is-active');
  }

  function hideModal(id){
    document.querySelector(id).classList.add('is-removing');
    setTimeout(function(){
      document.querySelector(id).classList.remove('is-active');
      document.querySelector(id).classList.remove('is-removing');
      document.querySelector('.snapwdg2-modal-bg').classList.remove('is-active');
    }, 300) // removal delay for animation
  }

  ////////////////
  // PRODUCT
  ///////////////
  // SLIDER
  var slider, sliderSlides, slideWidth, slides
  function parseSlider(){
    slider = document.querySelector('[js-snapwdg2-size-scroller]');
    sliderSlides = slider.children;
    slideWidth = 75;

    slides = Array.prototype.slice.call( document.querySelectorAll("[js-snapwdg2-product-size]") ); // helper to get index
    [].forEach.call(document.querySelectorAll("[js-snapwdg2-product-size]"), function(el){
      el.addEventListener('click', function(e){
        var curIndex = slides.indexOf(this);
        navigateSlide(curIndex);
      })
    })
  }

  parseSlider();

  // catch ajax to update slider
  addXMLRequestCallback( function( xhr ) {
    parseSlider();
  });

  function addXMLRequestCallback(callback){
    var oldSend, i;
    if( XMLHttpRequest.callbacks ) {
      XMLHttpRequest.callbacks.push( callback );
    } else {
      XMLHttpRequest.callbacks = [callback];
      oldSend = XMLHttpRequest.prototype.send;
      XMLHttpRequest.prototype.send = function(){
        for( i = 0; i < XMLHttpRequest.callbacks.length; i++ ) {
          XMLHttpRequest.callbacks[i]( this );
        }
        oldSend.apply(this, arguments);
      }
    }
  }

  // next/prev
  document.querySelector('[js-snapwdg2-next-slide]').addEventListener('click', function(){
    var curSlide = parseInt(slider.getAttribute('data-current-slide'));
    navigateSlide(curSlide + 1)
  })
  document.querySelector('[js-snapwdg2-prev-slide]').addEventListener('click', function(){
    var curSlide = parseInt(slider.getAttribute('data-current-slide'));
    navigateSlide(curSlide - 1)
  })

  // functions
  function navigateSlide(slide){
    if ( slide < 0 || slide >= sliderSlides.length ){
      return false
    }
    var calcTransform;
    var isFirst = sliderSlides[slide].previousElementSibling ? false : true;
    var isLast = sliderSlides[slide].nextElementSibling ? false : true;
    if ( isFirst ){
      calcTransform = slideWidth;
    } else if ( isLast ){
      calcTransform = - (slideWidth * slide) + slideWidth;
    } else {
      calcTransform = slideWidth - (slideWidth * slide);
    }

    slider.setAttribute('data-current-slide', slide);
    slider.style[transformProp] = 'translate3d(' + calcTransform + 'px,0,0)';

    updateSlideInfo(sliderSlides[slide])
  }

  function updateSlideInfo(el){
    var targetSize = el.getAttribute('data-size');
    var targetStars = el.getAttribute('data-fit-stars');
    var targetIsBest = el.getAttribute('data-bestfit');
    var targetFit1 = el.getAttribute('data-fit-1');
    var targetFit2 = el.getAttribute('data-fit-2');
    var targetFit3 = el.getAttribute('data-fit-3');

    // controll class
    [].forEach.call(document.querySelectorAll("[js-snapwdg2-product-size]"), function(control){
      control.classList.remove('is-active');
    })
    el.classList.add('is-active');

    // separate functions based on attributes
    setStars(targetStars);
    setIsBest(targetIsBest)
    setIcons(targetFit1, targetFit2, targetFit3)
  }


  function setStars(rate){
    var icons = document.querySelectorAll('[js-snapwdg2-set-product-stars] i')

    var fillIcon = 'snapwdg2-icon-star-fill'
    var halfIcon = 'snapwdg2-icon-star-half'
    var blankIcon = 'snapwdg2-icon-star-empty'

    // default state
    icons.forEach(function(icon, i){
      icon.classList.remove(fillIcon);
      icon.classList.remove(halfIcon);
      icon.classList.add(blankIcon);
    })

    icons.forEach(function(icon, i){
      if ( rate >= i + 1 ){
        icons[i].classList.add(fillIcon)
        if ( rate == i + 1.5 ){
          icons[i+1].classList.add(halfIcon)
        }
      }
    })
  }

  function setIsBest(isBest){
    // controll bestfit
    if ( isBest == "true" ){
      document.querySelector('[js-snapwdg2-set-bestfit]').classList.add('is-best')
    } else {
      document.querySelector('[js-snapwdg2-set-bestfit]').classList.remove('is-best')
    }
  }

  function setIcons(targetFit1, targetFit2, targetFit3){
    var elTargetFit1 = document.querySelector('[js-snapwdg2-set-productfit-1]');
    var elTargetFit2 = document.querySelector('[js-snapwdg2-set-productfit-2]');
    var elTargetFit3 = document.querySelector('[js-snapwdg2-set-productfit-3]');

    var iconFit1ok = 'snapwdg2-icon-fit_1_ok';
    var iconFit2ok = 'snapwdg2-icon-fit_2_ok';
    var iconFit3ok = 'snapwdg2-icon-fit_3_ok';
    var iconFit1med = 'snapwdg2-icon-fit_1_med';
    var iconFit2med = 'snapwdg2-icon-fit_2_med';
    var iconFit3med = 'snapwdg2-icon-fit_3_med';
    var iconFit1fail = 'snapwdg2-icon-fit_1_fail';
    var iconFit2fail = 'snapwdg2-icon-fit_2_fail';
    var iconFit3fail = 'snapwdg2-icon-fit_3_fail';

    // null all first
    elTargetFit1.className = 'snapwdg2-icon'
    elTargetFit2.className = 'snapwdg2-icon'
    elTargetFit3.className = 'snapwdg2-icon'

    if ( targetFit1 == "1" ){
      elTargetFit1.classList.add(iconFit1ok)
    } else if ( targetFit1 == "2" ){
      elTargetFit1.classList.add(iconFit1med)
    } else {
      elTargetFit1.classList.add(iconFit1fail)
    }

    if ( targetFit2 == "1" ){
      elTargetFit2.classList.add(iconFit2ok)
    } else if ( targetFit1 == "2" ){
      elTargetFit2.classList.add(iconFit2med)
    } else {
      elTargetFit2.classList.add(iconFit2fail)
    }

    if ( targetFit3 == "1" ){
      elTargetFit3.classList.add(iconFit3ok)
    } else if ( targetFit1 == "2" ){
      elTargetFit3.classList.add(iconFit3med)
    } else {
      elTargetFit3.classList.add(iconFit3fail)
    }

  }

});


// HELPER FUNCTIONS

function outerWidth(el) {
  var width = el.offsetWidth;
  var style = getComputedStyle(el);

  width += parseInt(style.marginLeft) + parseInt(style.marginRight);
  return width;
}

var transformProp = (function(){
  var testEl = document.createElement('div');
  if(testEl.style.transform == null) {
    var vendors = ['Webkit', 'Moz', 'ms'];
    for(var vendor in vendors) {
      if(testEl.style[ vendors[vendor] + 'Transform' ] !== undefined) {
        return vendors[vendor] + 'Transform';
      }
    }
  }
  return 'transform';
})();

(function (ElementProto) {
	if (typeof ElementProto.matches !== 'function') {
		ElementProto.matches = ElementProto.msMatchesSelector || ElementProto.mozMatchesSelector || ElementProto.webkitMatchesSelector || function matches(selector) {
			var element = this;
			var elements = (element.document || element.ownerDocument).querySelectorAll(selector);
			var index = 0;

			while (elements[index] && elements[index] !== element) {
				++index;
			}

			return Boolean(elements[index]);
		};
	}

	if (typeof ElementProto.closest !== 'function') {
		ElementProto.closest = function closest(selector) {
			var element = this;

			while (element && element.nodeType === 1) {
				if (element.matches(selector)) {
					return element;
				}

				element = element.parentNode;
			}

			return null;
		};
	}
})(window.Element.prototype);
