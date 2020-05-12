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
    if name.isalnum()==False:
        print('El nombre debe ser un valor alfanumérico')
        return False
    if len(name)>50 :
        print('El nombre debe tener hasta 50 caracteres')
        return False
    return True

def validate_integer(integ,min,max):
    if integ.isdigit()==False or int(integ)>int(max) or int(integ)<int(min):
        print('El valor debe ser en entero entre '+str(min)+' y '+str(max)+' incluídos')
        return False
    return True

def load_name(sql):
    accept=False
    while accept==False:
        print('Ingrese nombre de la impresora')
        name=input()
        if validate_names(name)==True:
            accept=True
            sql['nombre']=name
        else:
            new_input()

def load_axes(sql,tipo):
    accept=False
    while accept==False:
        print(tipo[-1]+': ')
        tam=input()
        if validate_integer(tam,50,2000)==True:
            accept=True
            sql[tipo]=tam
        else:
            new_input()

def load_tamanio(sql):
    print('Ingrese tamaño de la impresora en MILIMETROS')
    load_axes(sql,'tamanio_x')
    load_axes(sql,'tamanio_y')
    load_axes(sql,'tamanio_z')

def load_print(cursor,sql):
    insert="insert into impresoras (nombre,tamanio_x,tamanio_y,tamanio_z) VALUES (' "+str(sql['nombre'])+"',"+ \
           str(sql['tamanio_x'])+","+ \
           str(sql['tamanio_y'])+","+ \
           str(sql['tamanio_z'])+ " )"
    cursor.execute(insert)
    cursor.execute("SELECT * from impresoras") #executes the query to the database.

    print('Estas son las impresoras cargadas:')
    #print query result
    for row in cursor:
        print(row)

def main(cursor):
    print('Bienvenido a la Carga de impresoras manual')
    load=True
    sql={
        'nombre':None,
        'tamanio_x':None,
        'tamanio_y':None,
        'tamanio_z':None,
    }
    while load==True:
        load_name(sql)
        load_tamanio(sql)
        load_print(cursor,sql)
        print('Desea cargar otra impresora? (s=SI,otra tecla=NO)')
        wish_print=input()
        if str(wish_print)!=str('s'):
            load=False

#Ejecutamos el programa
main(cursor)

cursor.close() #close the pointer to the database.
conn.commit()
conn.close()   #close the connection to the database.