/*******************************************************************************
 * jRate v0.5 Requires jQuery
 * 
 * Changelog
 * 
 * v0.2: added ajaxOptions
 * 
 * v0.3: added startValue to set value on initalization
 * 
 * v0.4: added highlightPrevious, enable possibility to only highlight the selected star
 * 
 * v0.5: debugged highlightPrevious functionality, added startIndex
 * 
 * @author Olivier Tille, gplus.to/oliviernt
 * 
 * Options:
 * @param className:
 *            a string with your class name
 * @param stars:
 *            an integer with the amount of selectable "stars" required
 * @param ajaxOptions:
 *            object, see http://api.jquery.com/jQuery.ajax/ for options
 * @param highlightPrevious:
 * 			  boolean indicating wether or not the previous, unselected stars should be highlighted
 * @param startValue
 * 			  an integer for the value to start on
 * @param startIndex
 * 			  0 or 1 for where to start rating index
 * 
 * 
 * Copyright (c) 2011 Olivier Tille
 *
 * MIT License
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy 
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in 
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 ******************************************************************************/
;
(function($) {
	$.fn.jRate = function(options) {

		var $this,
			$mainSelector,
			defaults,
			activeClass,
			selectedClass,
			date,
			id,
			html,
			mainSelector,
			input,
			iCounter;

		defaults = {
			className : 'jRate',
			stars : 5,
			startValue : -1,
			ajaxOptions : null,
			highlightPrevious: true,
			startIndex: 0 //can be 0 or 1
		};

		$.extend(defaults, options);
		
		$this = this;
		
		$this.empty();//needs to be empty
		
		if (defaults.startIndex != 1) {
			defaults.startIndex = 0;
		}

		activeClass = "active";
		selectedClass = "selected";
		date = new Date();
		id = 'jR' + date.getTime();
		html = '';
		mainSelector = "." + defaults.className + " li a"; // main selector
		input = '<input />';

		for (iCounter = 0; iCounter < defaults.stars; iCounter++) {
			html += '<li class="' + defaults.className + '-' + (iCounter + defaults.startIndex ) + '">';
			html += '<a href="#">' + (iCounter + defaults.startIndex) + '</a>';
			html += '</li>';
		}
		$("<ul></ul>").attr({
			'class' : defaults.className + " jRate",
			'id' : id
		}).appendTo($this).append(html);

		$("<input />").attr({
			'type' : "hidden",
			'class' : defaults.className,
			'id' : id,
			'name' : defaults.className,
			'value' : defaults.startValue
		}).appendTo($this).addClass("jRate");
		
		$mainSelector = $(mainSelector);

		var $input = $('input[type=hidden]', $this);
		
		$input.live("change.jRate", function() {
			var iCounter = $(this).val() - defaults.startIndex;
			if (iCounter >= 0 && iCounter < defaults.stars && defaults.highlightPrevious) {
				$mainSelector.removeClass(activeClass);
				$(mainSelector + ":lt(" + iCounter + ")").addClass(activeClass);
				$(mainSelector + ":eq(" + iCounter + ")").addClass(activeClass);
				$mainSelector.removeClass(selectedClass);
			}
			else if (defaults.highlightPrevious == false) {
				$(mainSelector + ":eq(" + iCounter + ")").addClass(activeClass);
			}
		}).trigger("change.jRate");

		$mainSelector.bind("click.jRate", function() {
			$mainSelector.removeClass(selectedClass);
			var $t = $(this), iCounter = $mainSelector.index($t);
			$t.addClass(selectedClass);
			$input.val(iCounter + defaults.startIndex);
			// if the ajaxOptions are set, fire AJAX call
			if (defaults.ajaxOptions) {
				$.ajax(defaults.ajaxOptions);
			}
			return false;
		}).bind("mouseover.jRate", function() {
			$mainSelector.removeClass(activeClass);
			var iCounter = $mainSelector.index($(this));
			$(this).addClass(activeClass);
			if (defaults.highlightPrevious) {
				$(mainSelector + ":lt(" + iCounter + ")").addClass(activeClass);
			}
		}).bind("mouseout.jRate", function() {
			$mainSelector.removeClass(activeClass);
			var iCounter = $input.val() - defaults.startIndex;
			if (defaults.highlightPrevious) {
				$(mainSelector + ":lt(" + iCounter + ")," + mainSelector + ":eq(" + iCounter + ")").addClass(activeClass);
			}
			else {
				$(mainSelector + ":eq(" + iCounter + ")").addClass(activeClass);
				
			}
			$mainSelector.removeClass(selectedClass);
		}).trigger("mouseout.jRate");
	};
	return this;
})(jQuery);