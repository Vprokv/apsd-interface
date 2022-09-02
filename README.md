## Запуск проекта
* git clone http://gitlab.id-mt.ru/sedo/apsd-ui.git
* git submodule add https://gitlab.com/yarproko/components_ocean.git ./src/components_ocean
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