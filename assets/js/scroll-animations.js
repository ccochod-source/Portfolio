/*
	Scroll Animations for Portfolio
	Adds smooth fade-in and slide-up animations when scrolling down
*/

(function($) {
	
	// Wait for DOM to be ready
	$(document).ready(function() {
		
		// Elements to animate
		var $elementsToAnimate = $('article.post, .image.featured, #main h3, .mini-post h3, ul.posts h3, #main h4, .mini-post h4, ul.posts, .mini-post');
		
		// Function to check if element is in viewport
		function isInViewport(element) {
			var elementTop = $(element).offset().top;
			var elementBottom = elementTop + $(element).outerHeight();
			var viewportTop = $(window).scrollTop();
			var viewportBottom = viewportTop + $(window).height();
			
			return elementBottom > viewportTop && elementTop < viewportBottom;
		}
		
		// Function to animate elements
		function animateOnScroll() {
			$elementsToAnimate.each(function() {
				var $element = $(this);
				
				// Skip if already animated
				if ($element.hasClass('scroll-animated')) {
					return;
				}
				
				// Check if element is in viewport
				if (isInViewport($element)) {
					$element.addClass('scroll-animated');
				}
			});
		}
		
		// Initial check on page load
		animateOnScroll();
		
		// Check on scroll (with throttling for performance)
		var scrollTimeout;
		$(window).on('scroll', function() {
			clearTimeout(scrollTimeout);
			scrollTimeout = setTimeout(animateOnScroll, 50);
		});
		
		// Also check on resize
		$(window).on('resize', function() {
			animateOnScroll();
		});
		
	});
	
})(jQuery);

