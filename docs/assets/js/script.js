const SLIDE_HIDDEN = 'slide_hidden';
const SLIDENAV_ACTIVE = 'slide-nav__item_active';
const SLIDENAV_HIDDEN = 'slide-nav__item_hidden';
const SLIDEBUTTON_BACK = 'slide__nav-buttons_back';
const CHOICE_ACTIVE = 'choice_active';

let find = (selector, e=document) => Array.from( e.querySelectorAll(selector) );
let get = id => document.getElementById(id);
let is = (e, cssClass) => e?.classList.contains(cssClass);
let set$ = (e, cssClass) => e?.classList.add(cssClass);
let unset$ = (e, cssClass) => e?.classList.remove(cssClass);

let $slideId = e => Number(e.getAttribute('data-slide'));
let $dialogId = e => e.getAttribute('data-dialog');

let $slideNavs       = () => find(`.slide-nav__item`);
let $slides          = () => find(`.slide`);
let $slideNavButtons = () => find(`.slide__nav-buttons .button`);
let $slideActive     = () => $slides().find(e => !is(e, SLIDE_HIDDEN));
let $slideNavActive  = () => $slideNavs().find(e => is(e,SLIDENAV_ACTIVE));
let $slide           = id => $slides().find(e => $slideId(e) == id);
let $slideNav        = id => $slideNavs().find(e => $slideId(e) == id);
let $dialogs         = () => find(`.dialog`);
let $closeButtons    = e => find(`.dialog__close`, e);
let $openButtons     = () => find(`[data-dialog]`);
let $fieldsets       = () => find(`fieldset`);
let $choices         = e => find(`.choice > input`, e);
let $choiceLabel     = e => e.parentNode;

function _nextSlide(step) {
    let [_active, _activeNav] = [$slideActive(), $slideNavActive()];
    console.debug(_active, _activeNav);
    let _id = $slideId(_active) + step;
    let [_slide, _nav] = [$slide(_id), $slideNav(_id)];
    console.debug(_slide, _nav);
    if (_slide) {
        set$(_active, SLIDE_HIDDEN);
        unset$(_slide, SLIDE_HIDDEN);
        unset$(_activeNav, SLIDENAV_ACTIVE);
        unset$(_nav, SLIDENAV_HIDDEN);
        set$(_nav, SLIDENAV_ACTIVE);
    }
}

let $nextSlide = () => _nextSlide(+1);
let $prevSlide = () => _nextSlide(-1);

addEventListener('DOMContentLoaded', () => {
    $slideNavButtons().forEach(e =>
        e.addEventListener('click', (is(e, SLIDEBUTTON_BACK) ? $prevSlide : $nextSlide)));
    
    $dialogs().forEach(dialog => $closeButtons(dialog).forEach(e => 
        e.addEventListener('click', () => dialog.close())));
        
    $openButtons().forEach(e => 
        e.addEventListener('click', () => get( $dialogId(e) ).showModal()));

    $fieldsets().forEach(fields => $choices(fields).forEach(input => 
        input.addEventListener('input', () => $choices(fields).forEach(e => 
            (e.checked ? set$ : unset$)($choiceLabel(e), CHOICE_ACTIVE)))));
});

