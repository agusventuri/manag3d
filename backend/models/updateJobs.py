import pymysql
import models.constants as consts


def update_jobs(id, impresora):
    conn = pymysql.connect(unix_socket=consts.DB_HOST, user=consts.DB_USER, passwd=consts.DB_PASS, db=consts.DB_NAME)
    # conn = pymysql.connect(host=consts.DB_HOST_REMOTE, user=consts.DB_USER_REMOTE, passwd=consts.DB_PASS_REMOTE, db=consts.DB_NAME_REMOTE)
    cursor = conn.cursor()  #connection pointer to the database.
    if impresora == 0:
        update = "update impresiones set id_impresora = NULL, estado=1  where id=" + str(id) + ";"
    else:
        update = "update impresiones set id_impresora =" + str(impresora) + ", estado=1 where id=" + str(id) + ";"

    cursor.execute(update)
    cursor.close() #close the pointer to the database.
    conn.commit()
    conn.close()
    return 'Se actualizo la impresion'
