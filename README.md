## Как сделать локальный клон проекта?
* `git clone git@gitlab.id-mt.ru:sedo/apsd-ui.git`
* `git submodule add git@gitlab.id-mt.ru:sedo/components_ocean.git ./src/components_ocean`


## Как запустить проект локально?
1. Создать файл `.env.local` со следующим содержанием:
```
REACT_APP_API_BASE_URL=http://192.168.42.105
```
2. Выполняем команды:
* `npm install`
* `npm run start`

## Обновление проекта
* `git pull`
* `npm install`
* `npm run start`

## В случае, если возникли проблемы после пулла
* `git submodule update --init --recursive`
* `git pull`
* `npm install`
* `npm run start`
