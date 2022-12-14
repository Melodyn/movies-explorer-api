[![Production](../../actions/workflows/backend.yml/badge.svg?branch=main)](../../actions/workflows/backend.yml?query=workflow%3A"Production")

# Дипломный проект Практикум веб-10

Сервис, в котором можно найти фильмы по запросу и сохранить в личном кабинете.

* Backend: https://api.diploma.melodyn.nomoredomains.icu

## Технологии

Бэкенд:
* Node.js
* MongoDB + Mongoose

## Установка и запуск

Требования:

* Node.js >= 14;
* npm >= 6.14;
* (опционально) make >= 4;

> 💡 Команды прописаны для утилиты `make`, но если её нет, то исходные команды можно найти в Makefile в каталогах с 
исходниками

Развёртывание:

* `make setup` - установка зависимостей и запуск;

Использование

* `make run` - запуск приложения;
* `make lint` - запустить линтер;
