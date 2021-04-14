import { darken, invert } from 'polished'
import { createGlobalStyle } from "styled-components";

export default createGlobalStyle`
  body, .modal-content {
    background: ${props => props.theme.background};
    color: ${props => props.theme.text};
  }

  .welcome {
    background: ${props => darken(.05, props.theme.background)}
  }

  .header {
    background: ${props => props.theme.primary};

    a.dropdown-item {
      &.active {
        color: ${props => props.theme.primary}
      }

      &:focus {
        background: ${props => props.theme.primary};
      }
    }
  }

  hr, .users header strong::before {
    background: ${props => props.theme.text};
  }

  .profile {
    background: ${props => props.theme.profile};
    
    li {
      background: ${props => props.theme.profileList};
      color: ${props => props.theme.text};
    }
  }

  .dropzone {
    background: ${props => props.theme.inputBg};
    color: ${props => props.theme.text};
  }

  .form-control {
    background: ${props => props.theme.inputBg};
    color: ${props => props.theme.text};
    
    &:focus {
      background: ${props => props.theme.inputBg};
      box-shadow: 0 0 0 2.5px ${props => props.theme.shadow};
      color: ${props => props.theme.text};
    }
  }

  .css-1pahdxg-control {
    box-shadow: 0 0 0 2.5px ${props => props.theme.shadow} !important;
  }

  .react_select__control, .css-1pahdxg-control {
    background: ${props => props.theme.inputBg} !important;

    &:focus {
      background: ${props => props.theme.inputBg} !important;
      box-shadow: 0 0 0 2.5px ${props => props.theme.shadow} !important;
    }
  }

  .react_select__multi-value, .react_select__menu, .react_select__menu-list, .react_select__option--is-focused {
    background: ${props => props.theme.profile} !important;
  }

  .react_select__option {
    &:focus, &:active, &:hover {
      background: ${props => darken(.1, props.theme.profile)} !important;
    }
  }

  .react_select__multi-value__label, .react_select__indicator, .react_select__placeholder, .react_select__input, .ql-header, .ql-snow .ql-picker.ql-expanded .ql-picker-label, .ql-snow.ql-toolbar .ql-picker-label:hover, .ql-snow.ql-toolbar .ql-picker-item:hover, .ql-snow.ql-toolbar .ql-picker-label.ql-active {
    color: ${props => props.theme.text} !important;
  }
  
  .ql-toolbar, .ql-container, .ql-picker-options {
    background: ${props => props.theme.inputBg};
    color: ${props => props.theme.text};
  }
  
  .ql-snow .ql-picker-options {
    background: ${props => props.theme.profile} !important;
  }


  .ql-snow .ql-picker:not(.ql-color-picker):not(.ql-icon-picker) svg *, .ql-formats svg * {
    stroke: ${props => props.theme.text} !important;
  }

  .tag li {
    background: ${props => props.theme.text};
    color: ${props => invert(props.theme.text)};
  }

  .detach__highlight, .post__highlight {
    box-shadow: 0 .15rem .5rem .05rem ${props => props.theme.shadow}
  }

  .form-control::placeholder {
    color: ${props => props.theme.text};
    font-style: italic;
    opacity: .7;
  }

  .post__highlight {
    background: ${props => props.theme.background};

    &-item, &-item:hover, small {
      color: ${props => props.theme.text};
    }
  }
`