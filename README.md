## Запуск проекта
* git clone git@gitlab.id-mt.ru:sedo/apsd-ui.git
* git submodule add git@gitlab.id-mt.ru:sedo/components_ocean.git ./src/components_ocean
* npm install
* npm run start

## Обновление проекта
* git pull
* npm install
* npm run start

## В случае, если возникли проблемы после пулла
* git submodule update --init --recursive
* git pull
* npm install
* npm run start