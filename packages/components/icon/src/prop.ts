import { ExtractPropTypes } from 'vue';

export const iconProps = {
  size: {
    type: String
  },
  color: {
    type: String
  }
};

export type IconProps = ExtractPropTypes<typeof iconProps>
