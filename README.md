## Git workflow
1. Делаем клон от ветки `master` в локальную ветку обязательно с номером задачи и желательно с кратким описанием 
`feature/APSD-1_content_tab` или `bug/APSD-2_save_document`
2. После завершения работы над задачей делаем [мерж реквест](http://gitlab.id-mt.ru/sedo/apsd-ui/merge_requests/new) обратно в `master`

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
