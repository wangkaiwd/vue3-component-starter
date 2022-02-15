import { App, Plugin } from 'vue';

type SFCWithInstall<T> = T & Plugin

export const withInstall = <T> (component: T) => {
  (component as any).install = function (app: App) {
    app.component((component as any).name, component);
  };
  return component as SFCWithInstall<T>;
};
