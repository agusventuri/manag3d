import pymysql

class Jobs:
    def update_jobs(id,impresora):
        URL= "https://console.clever-cloud.com/"
        User= "danielfpaz1@gmail.com"
        passw="y6s.k9gVWAgHJUi"

        conn = pymysql.connect(
            host = "bxgiympztcdyk1mlijne-mysql.services.clever-cloud.com",  # server
            user = "ufi5pvu38rgxyyki",		# user
            passwd = "wDA27vy9GAK4UVepDOHx",		# user password
            db = "bxgiympztcdyk1mlijne")		# database name
        cursor = conn.cursor()  #connection pointer to the database.
        if impresora == 0:
            update="update impresiones set id_impresora = NULL where id="+ str(id) + ""
        else:
            update="update impresiones set id_impresora ="+ str(impresora) + " where id="+ str(id) + ""

        cursor.execute(update)


        cursor.close() #close the pointer to the database.
        conn.commit()
        conn.close()
        return 'Se actualizo la impresion'
