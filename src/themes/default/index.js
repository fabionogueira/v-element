import './index.scss';
import theme from '../../core/theme';

theme.set({
    name: 'default',
    viewBox: '0 0 24 24',
    
    // https://materialdesignicons.com/
    icons:{
        'arrow_down': {
            content: '<path d="M7.41 7.84L12 12.42l4.59-4.58L18 9.25l-6 6-6-6z"/>'
        },
        'arrow_up':{
            content: '<path d="M7.41,15.41L12,10.83L16.59,15.41L18,14L12,8L6,14L7.41,15.41Z"/>'
        },
        'menu-arrow-down':{
            content: '<path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" />'
        }
    }
});
