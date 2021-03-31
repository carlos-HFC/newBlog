import { createGlobalStyle } from "styled-components";
import { darken } from 'polished'

export default createGlobalStyle`
  body, .modal-content {
    background: ${props => props.theme.background};
    color: ${props => props.theme.text};
  }

  header {
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

  hr {
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

  .react_select__multi-value__label, .react_select__indicator, .react_select__placeholder, .react_select__input {
    color: ${props => props.theme.text} !important;
  }
`