import imagesLoaded from 'imagesloaded'
import Vue from 'vue'

function isEqual (firstArray, secondArray) {
    const length = firstArray.length
    if ( length != secondArray.length) {
        return false;
    }   
    for (let i = 0; i < length; i++) {
        const first = firstArray[i], second = secondArray[i]
        if ((first.img!==second.img) || (first.src!==second.src)){
            return false;
        }
    }   
    return true;
}

function checkFunction(callBack, message=''){
    if (typeof callBack !=='function'){
        throw `imageLoaded directive error: object ${callBack} should be a function ${message}`
    }
}

function registerImageLoaded(imgLoad, {value, arg, modifiers}) {

    if( !arg && typeof value == 'object' ) {
        if( typeof value['events'] != 'undefined' ) {
            for( var key in value['events'] ) {
                let cb = value['events'][key];
                imgLoad['on'](key, (inst, img) => setTimeout(() => cb(inst, img)))
            }
        }
        return;
    }

    if (!arg) {
        checkFunction(value)
        imgLoad.on('always', (inst) => setTimeout(() => value(inst)) )
        return
    }

    const hasModifier = !!modifiers && !!Object.keys(modifiers).length
    const keys = hasModifier ? modifiers : value;
    const getCallBack = hasModifier ? (key) => {return value;} : (key) => value[key];

    for (var key in keys) {
        const callBack = getCallBack(key)
        checkFunction(callBack, !hasModifier? `property ${key} of ${value}` : '')
        imgLoad[arg](key, (inst, img) => setTimeout(() => callBack(inst, img)))
    } 
}

function applyImagesLoaded (el, binding) {
    let settings = {};
    if( typeof binding.value == 'object' && typeof binding.value['settings'] == 'object' )
        settings = binding.value.settings;


    const newContext = imagesLoaded( el, settings );

    const contextImages = newContext.images.map( (img,k) => {
        return {img: (typeof img['element'] == 'undefined' ? img.img : img.element), src: img.img.src}
    })
    //return;


    const oldcontextImages = el.__imagesLoaded__.context
    if (isEqual(oldcontextImages, contextImages)) {
        if( oldcontextImages.length == 0 && contextImages.length == 0 ) {
            if( typeof binding == 'object' && typeof binding['value'] == 'object' ) {
                if( typeof binding['value']['events'] != 'undefined' && typeof binding['value']['events']['no_images'] == 'function' ) {
                    binding['value']['events']['no_images']();
                }
                return;
            }
        }
        return
    }

    registerImageLoaded( newContext, binding)
    Object.assign(el.__imagesLoaded__, {context: contextImages, imageLoaded: newContext})
}

export default {
    bind (el) {
        el.__imagesLoaded__ = { context: [] }
    },
    inserted (el, binding){
        applyImagesLoaded(el, binding)
    },
    componentUpdated (el, binding){
        Vue.nextTick( () => {
            applyImagesLoaded(el, binding)
        });       
    },
    unbind (el, binding) {
        el.__imagesLoaded__ = null
    }
}