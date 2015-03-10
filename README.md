# Tooltip
Make a custom tooltip that can be implemented in any html element and being shown by a click or mouseover event.

## Usage

### HTML
```html
<a href="#" data-toggle="tooltip" data-tooltip="Example tooltip!"></select>
```

### JS
```javascript
$(function(){
	$('[data-toggle="tooltip"]').tooltip();
})
```

## Parameters in the element

- data-tooltipo: text | html
- data-event: mouseover (default) | click
- data-position: top (default) | left | right | bottom
- data-show: false (default) | true
- data-align: center (default) | left | right

## Requirements:
jQuery
