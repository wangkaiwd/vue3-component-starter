### tsconfig.json
* [project-reference](https://www.typescriptlang.org/docs/handbook/project-references.html#what-is-a-project-reference)

### pnpm
two ways of `pnpm` run command in subproject package.json scripts:
```shell
# 1
pnpm dev --filter @sppk/play

# 2
pnpm -C play dev
``` 
