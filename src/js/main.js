document.addEventListener('DOMContentLoaded', function(){

  // show modal
  [].forEach.call(document.querySelectorAll("[js-modal]"), function(el){

    el.addEventListener('click', function(e) {
      var target = el.getAttribute('href')
      showModal(target);
    });

  });

  // close
  [].forEach.call(document.querySelectorAll("[js-close-modal]"), function(el){
    el.addEventListener('click', function(e) {
      var targetModal = e.target.closest('.snapwdg2-modal')
      hideModal( "#" + targetModal.getAttribute('id') )
    })
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
      document.querySelector(id).classList.remove('is-active')
      document.querySelector(id).classList.remove('is-removing');
      document.querySelector('.snapwdg2-modal-bg').classList.remove('is-active');
    }, 300)
  }



});


// HELPER FUNCTIONS

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
