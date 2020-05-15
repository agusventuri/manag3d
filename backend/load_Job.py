import pymysql

URL= "https://console.clever-cloud.com/"
User= "danielfpaz1@gmail.com"
passw= "y6s.k9gVWAgHJUi"

conn = pymysql.connect(
    host = "bxgiympztcdyk1mlijne-mysql.services.clever-cloud.com", #server
    user = "ufi5pvu38rgxyyki",		#user
    passwd = "wDA27vy9GAK4UVepDOHx",		#user password
    db = "bxgiympztcdyk1mlijne")		#database name

cursor = conn.cursor()  #connection pointer to the database.

def new_input():
    print("Por favor, ingrese nuevamente")

def validate_names(name):
    cp=name.replace(" ","")
    if cp.isalpha()==False:
        print('El nombre debe ser una cadena de texto')
        return False
    if len(name)>50 :
        print('El nombre debe tener hasta 50 caracteres')
        return False
    return True

#valido tiempos
def validate_times(time,tipo):
    if tipo=='hours':
        #si estoy validando horas..
        return validate_integer(time,0,200)
    else:
        #si valido minutos o segundos..
        return validate_integer(time,0,59)

def validate_integer(integ,min,max):
    if integ.isdigit()==False or int(integ)>int(max) or int(integ)<int(min):
        print('El valor debe ser en entero entre '+str(min)+' y '+str(max)+' incluídos')
        return False
    return True

def load_names(sql,tipo):
    accept=False
    while accept==False:
        print('Ingrese '+tipo+' del trabajo:')
        name=input()
        if validate_names(name)==True:
            accept=True
            sql[tipo]=name
        else:
            new_input()

def load_times(times,tipo):
    accept=False
    while accept==False:
        print(tipo+': ')
        time=input()
        if validate_times(time,tipo)==True:
            accept=True
            times[tipo]=time
        else:
            new_input()

def load_estimated_time(times):
    load_times(times,'hours')
    load_times(times,'minutes')
    load_times(times,'seconds')

def load_order(sql):
    accept=False
    while accept==False:
        print('Ingrese número de orden')
        ord=input()
        if validate_integer(ord,0,10000)==True:
            accept=True
            sql['orden']=ord
        else:
            new_input()

def load_printer(sql):
    accept=False
    while accept==False:
        print('Ingrese Id de impresora')
        id=input()
        if validate_integer(id,0,100)==True:
            accept=True
            sql['id_impresora']=id
        else:
            new_input()


def load_job(cursor,sql,times):
    tiempo_estimado=3600*int(times['hours'])+60*int(times['minutes'])+int(times['seconds']) #segundos
    sql['tiempo_estimado']=tiempo_estimado
    fields = (str(list(sql.keys()))[1:-1])
    values = (str(list(sql.values()))[1:-1])
    #insert = 'insert into impresiones ('+fields+') VALUES (' + values + ')'
    insert="insert into impresiones (nombre,id_impresora,estado,cliente,orden,tiempo_estimado) VALUES ('"+str(sql['nombre'])+"',"+ \
                                                    str(sql['id_impresora'])+","+\
                                                    str(1)                    +",'"+ \
                                                    str(sql['cliente'])+"',"+ \
                                                    str(sql['orden'])+","+ \
                                                    str(sql['tiempo_estimado'])+ ")"
    print(insert)
    cursor.execute(insert)
    cursor.execute("SELECT * from impresiones") #executes the query to the database.

    print('Estos son los trabajos cargados:')
    #print query result
    for row in cursor:
        print(row)


def main(cursor):
    print('Bienvenido a la Carga de trabajo manual')
    load=True
    sql={
        'nombre':None,
        'id_impresora':'NULL',
        'estado':1,
        'cliente':None,
        'orden':'NULL',
        'tiempo_estimado':None,
    }
    times={'hours':None,
           'minutes':None,
           'seconds':None
           }
    while load==True:
        load_names(sql,"nombre")
        load_names(sql,"cliente")
        print('Ingrese tiempo de trabajo estimado')
        load_estimated_time(times)
        print('Desea asignarle una impresora al trabajo? (s=SI,otra tecla=NO)')
        wish_pri=input()
        if str(wish_pri)==str('s'):
            load_printer(sql)
            load_order(sql)
        load_job(cursor,sql,times)
        print('Desea cargar otro trabajo? (s=SI,otra tecla=NO)')
        wish_job=input()
        if str(wish_job)!=str('s'):
            load=False
#Ejecutamos el programa
main(cursor)

cursor.close() #close the pointer to the database.
conn.commit()
conn.close()   #close the connection to the database.