#!/bin/sh
set -e
echo
echo Welcome to Olivia, an emote bot for Discord!
echo Press \"Y\" to create the database or \"N\" to exit.

read -p 'Option: ' option

if [[ ! $option =~ [Yy] ]]
then
    echo Exiting...
    exit 0
fi

echo Creating database \"olivia\"...
sudo -u postgres createdb olivia
echo Created database \"olivia\"!