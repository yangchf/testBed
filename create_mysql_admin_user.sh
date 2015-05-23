#!/bin/bash

/usr/bin/mysqld_safe > /dev/null 2>&1 &

RET=1
while [[ RET -ne 0 ]]; do
    echo "=> Waiting for confirmation of MySQL service startup"
    sleep 5
    mysql -uroot -e "status" > /dev/null 2>&1
    RET=$?
done

#PASS=${MYSQL_PASS:-$(pwgen -s 12 1)}
#_word=$( [ ${MYSQL_PASS} ] && echo "preset" || echo "random" )
#echo "=> Creating MySQL admin user with ${_word} password"

#mysql -uroot -e "CREATE USER 'admin'@'%' IDENTIFIED BY '$PASS'"
#mysql -uroot -e "GRANT ALL PRIVILEGES ON *.* TO 'admin'@'%' WITH GRANT OPTION"
mysql -uroot -e "CREATE USER 'realityload'@'%' IDENTIFIED BY 're@lityl0@d'"
mysql -uroot -e "GRANT ALL PRIVILEGES ON *.* TO 'realityload'@'%' WITH GRANT OPTION"
mysql -uroot -e "CREATE DATABASE IF NOT EXISTS opencart DEFAULT CHARACTER SET utf8"

mysql -urealityload -pre@lityl0@d -D opencart < ./opencart.sql

echo "Initialize the database => Done!"

echo "========================================================================"
echo "You can now connect to this MySQL Server using:"
echo ""
echo "    mysql -urealityload -p<password> -h<host> -P<port>"
echo ""
echo "MySQL user 'root' has no password but only allows local connections"
echo "========================================================================"

mysqladmin -uroot shutdown
