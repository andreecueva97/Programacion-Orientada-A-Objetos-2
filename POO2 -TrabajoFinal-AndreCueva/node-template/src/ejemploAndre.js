require('@pmoo/oow');

class Cliente{//CLIENTE ES LA PERSON QUE PUEDE TENER UN NUMERO Y UNA CUENTA, DEBIDO A QUE ES UN TELEFONO PREPAGO
    constructor(telefono,nombre){
        this.nombre=nombre;            //NOMBRE DEL CLIENTE
        this.numeroTelefono=telefono;//NUMERO DEL CLIENTE
        this.cuenta=new Cuenta();//CUENTA DEL CLIENTE
    }
    consultaSaldoActual(){  //INDICA EL SALDO ACTUAL DE LA CUENTA DEL CLIENTE
        this.cuenta.mostrarSaldo();
    }
    cargarSaldo(dineroIngresado){       //INDICA QUE SE VA A AGREGAR DINERO A LA CUENTA DEL CLIENTE
        this.cuenta.agregarSaldo(dineroIngresado);
    }
    cambiarPaqueteActual(identificadorPaqueteNuevo){  //INDICA QUE VA A HABER UN CAMBIO DEL PAQUETE ACTUAL AL PAQUETE POR PARAMETRO
        this.cuenta.paqueteAModificar(identificadorPaqueteNuevo);
    }
    contratarPaquete(lista,paquete,cuenta,renovacionAutomaticaDelPaqueteSiONo,fecha){ //INDICA QUE PUEDE CONTRATAR PUEDE O NO CONTRATAR EL PAQUETE QUE QUIERE
        if(lista.puedeContratar(cuenta)){//VERIFICA QUE SE CUMPLAN LAS REGLAS
            this.cuenta.paqueteAModificar(paquete.mostrarId());
            this.cuenta.paqueteAutoRenovar(renovacionAutomaticaDelPaqueteSiONo);
            this.cuenta.debitarPaquete(paquete.mostrarCosto());
            this.cuenta.fechaContratadoPaquete(fecha);
        }
        else{
            throw 'NO PODES CONTRATAR';// puede ser por falta de plata o porque tenes ya un paquete disponible
        }
    }
    mostrarNumeroTelefono(){
        return this.numeroTelefono;
    }
    mostrarCuenta(){
        return this.cuenta;
    }
    mostrarNombre(){
        return this.nombre;
    }
}

class Compania{//COMPANIA TELEFONICA
    constructor(){
        this.telefonos=[111,222,333];//Telefonos de los clientes de la compania
    }
    descontar(MB,MINUTOS,PAQUETE,appconsumo){//DESCUENTA LA CAPACIDAD DEL PAQUETE
        PAQUETE.consumidosMBApp(appconsumo);
        if(this.podesUsar(MB,MINUTOS,PAQUETE)){//SI SE PUEDE CONSUMIR 
            PAQUETE.consumidosMB(MB);              //restarle MB
            PAQUETE.consumidosMinutos(MINUTOS);    //restarle MINUTOS
        }
        else{
            throw 'GB O MINUTOS NO DISPONIBLES';//NO SE PUEDE CONSUMIR MAS
            
        }
    }
    podesUsar(MB,MINUTOS,PAQUETE){//Indica que podes usar MB o Minutos PORQUE TODAVIA TENES DISPONIBLES
        return MB<= PAQUETE.mostrarDatosMoviles() && MINUTOS <=PAQUETE.mostrarDatosMinutos();
    }
    paqueteRenovar(cliente,lista,paquete,cuenta,renovacionAutomaticaDelPaqueteSiONo,fecha){// INDICA QUE CIERTO CLIENTE VA A RENOVAR ALGUN PAQUETE POR VENCIDO O AGOTADO
        if(paquete.agotado()&&cliente.mostrarCuenta().mostrarRenovacionAutomatica()=='si'){
            cliente.contratarPaquete(lista,paquete,cuenta,renovacionAutomaticaDelPaqueteSiONo,fecha);
        }
    }
    mostrarClientes(){
        return this.telefonos;
    }
}

class Cuenta{//LA CUENTA ES DE UN CLIENTE PERO LA CUENTA ES QUIEN TIENE ASOCIADA UN PAQUETE
    constructor(){
        this.saldo=0;
        this.paquete=0;//no tiene paquete ahora luego se le asigna un id del tipo del paqute que posee
        this.fechaAdquiridoPaquete;
        this.autoRenovacion;//SI O PUEDE SER NO
        this.ConsumosRealizadosHistorial = new HistorialDeConsumos();//////////////////////////////////////////////////////
    }
    debitarPaquete(costoDelPaquete){ //SE DESCUENTA EL DINERO DEBIDO A QUE COMPRASTE UN PAQUETE
        this.saldo=this.saldo-costoDelPaquete;
    }
    agregarSaldo(dineroIngresado){  //SE AGREGA SALDO A LA CUENTA
        this.saldo=this.saldo+dineroIngresado;
    }
    paqueteAutoRenovar(opcionElegida){  //SE AGREGA LA DECISION SI EL PAQUETE NUEVO SERA AUTOMATICAMENTE
        this.autoRenovacion=opcionElegida;
    }
    paqueteAModificar(identificadorPaquete){ //INDICA QUE PAQUETE TIENE ASOCIADA LA CUENTA
        this.paquete=identificadorPaquete;
    }
    fechaContratadoPaquete(fecha){ // INDICA LA FECHA EN LA QUE ES ADQUIRIDO EL PAQUETE
        this.fechaAdquiridoPaquete=fecha;
    }
    mostrarPaquete(){
        return this.paquete;
    }
    mostrarSaldo(){
        return this.saldo;
    }
    mostrarRenovacionAutomatica(){
        return this.autoRenovacion;
    }
    mostrarFechaContratadoPaquete(){
        return this.fechaAdquiridoPaquete;
    }
}

class Paquete{//PAQUETE QUE CONTIENE LOS DATOS MOVILES Y MINUTOS DISPONIBLES POR PAQUETE
    constructor(identificador,cantidaddatos,cantidadminutos,cantidaddias,costo,app){
        this.id=identificador;//inidica el tipo de paquete
        this.datosMoviles=cantidaddatos;//cantidad de datos que tiene el paquete
        this.datosMinutos=cantidadminutos;//cantidad de minutos que tiene el paquete
        this.dias=cantidaddias;//cantidad de dias que tiene el paquete
        this.costo=costo;//costo que tiene el paquete
        this.appMB=0;
        this.appNombre=app;
    }
    agotado(){//ya no queda nada para consumir Excepto que tenga una APP ASOCIADA
        if(this.appNombre === ''){
            return this.datosMoviles ==0 && this.datosMinutos==0;//SI NO TIENE APP Y AGOTO EL PAQUETE
        }
        else{
            return false;//SI TIENE APP ILIMITADA EL PAQUETE NO SE ACABA PERO SE PUEDE VENCER
        }
    }
    vencido(fechaHoy,fechaExpiracion){//si se paso de la fecha actual esta vencido
        return fechaHoy>fechaExpiracion;
    }
    consumidosMB(MB){//resta los datosMoviles que son usados A LOS DATOS MOVILES TOTALES DEL PAQUETE
        this.datosMoviles=this.datosMoviles-MB;
    }
    consumidosMinutos(MINUTOS){//resta los datosMinutos que son usados A LOS DATOS MINUTOS TOTALES DEL PAQUETE
        this.datosMinutos=this.datosMinutos-MINUTOS;
    }
    consumidosMBApp(MB){
        this.appMB=this.appMB+MB;
    }
    mostrarId(){
        return this.id;
    }
    mostrarDatosMoviles(){
        return this.datosMoviles;
    }
    mostrarDatosMinutos(){
        return this.datosMinutos;
    }
    mostrarDatosMovilesApp(){
        return this.appMB;
    }
    mostrarNombreApp(){
        return this.appNombre;
    }
    mostrarTiempoDeDuracion(){
        return this.dias;
    }
    mostrarCosto(){
        return this.costo;
    }
}
class SistemaExterno{//LO UNICO QUE VA A REALIZAR ES MOSTRAR INFORMACION
    constructor(numeroTelefono,MB,minutos,inicio,fin,app){
        this.telefono=numeroTelefono;
        this.datosMoviles=MB;
        this.datosMinutos=minutos;
        this.fechaInicial=inicio;
        this.fechaFinal=fin;
        this.datosMovilesApp=app;
    }
    mostrarCantidadConsumidosDeDatosMoviles(){
        return this.datosMoviles;
    }
    mostrarCantidadConsumidosDeDatosMinutos(){
        return this.datosMinutos;
    }
    mostrarCantidadConsumidosDeDatosMovilesApp(){
        return this.datosMovilesApp;
    }
    mostrarFechaInicial(){
        return this.fechaInicial;
    }
    mostrarFechaFinal(){
        return this.fechaFinal;
    }
}

class HistorialDeConsumos{ //HISTORIAL TOTAL DE LOS CONSUMOS
    constructor(){
        this.registro=[];
    }
    filtrar(nuevoHistorial){//ASIGNO UN REGISTRO CON HISTORIAL AL REGISTRO VACIO.
        this.registro= nuevoHistorial;
    }
    agregarConsumoHistorial(a){//AGREGA CONSUMO REALIZADO DEL SISTEMAEXTERNO
        this.registro.push(a);
    }
    mostrarOrdenPorFechas(){//LISTADO DE LOS CONSUMOS MAS RECIENTES A MENOS RECIENTES
        this.registro.sort((a,b)=> b.mostrarFechaInicial()-a.mostrarFechaInicial());
        return this.registro;
    }
    mostrarEntreEstasFechas(inicial,final){//LISTADO DE CONSUMOS TIENEN EN CUENTA EL INTERVALO DE FECHAS QUE QUIERO SABER EL SON 
                                           //inicial y final son SISTEMAEXTERNO ENTONCES DEBES USAR SUS METODOS PARA INGRESAR A SUS FECHAS
        const mandarOrden =this.registro.filter(consumo=>consumo.mostrarFechaInicial() >= inicial && consumo.mostrarFechaFinal() <= final);
        return mandarOrden;
    }
    mostrarRegistro(){
        return this.registro;//ME DEVUELVE LA LISTA DE LOS REGISTRO DE LOS CONSUMOS ALMACENADOS         
    }
}

class ContratarPaquete{//SE ENCARGA DE AGREGAR LAS REGLAS PARA CONTRATAR ALGUN PAQUETE Y INDICA SI PUEDE CONTRATAR
    constructor(){
        this.reglasParaObtenerPaquete=[];
    }
    inicioConfiguracion(regla){
        this.reglasParaObtenerPaquete.push(regla);
    }
    puedeContratar(cuenta){
        return this.reglasParaObtenerPaquete.any(regla=>regla.puedeHacerlo(cuenta));
    }
}

class ReglasContratarPaquete{//SOLO CONSIDERE DOS REGLAS (SALDO SUFICIENTE,SINPAQUETECONTRATADO)
    static clienteconSaldoSuficiente(preciopaquete){//REGLA SALDOSUFICIENTE
        return new ClienteSaldoSuficiente(preciopaquete);
    }
    static clienteSinPaqueteContratado(idpaquetecero){//REGLA SINPAQUETECONTRATADO
        return new ClienteSinPaqueteContratado(idpaquetecero);
    }
     puedeHacerlo(cuenta){
         throw 'nothing';
     }
}

class ClienteSaldoSuficiente extends ReglasContratarPaquete {//REGLA SALDOSUFICIENTE INDICARA SI EL CLIENTE TIENE EN SU CUENTA EL SALDO NECESARIO PARA COMPRAR CIERTO PAQUETE
    constructor(preciopaquete) {
      super();
      this.costopaquete = preciopaquete;
    }
    puedeHacerlo(cuenta) {//INDICA QUE SE CUMPLE PARA CIERTA CUENTA
      return this.costopaquete< cuenta.mostrarSaldo();//VERIFICA SI LA CUENTA TIENE EL DINERO NECESARIO PARA COMPRAR CIERTO PAQUETE
    }                                                //EN TAL CASO PUEDE COMPRAR PAQUETE
  }
  
class ClienteSinPaqueteContratado extends ReglasContratarPaquete {//REGLA SINPAQUETECONTRATADO INDICARA SI EL CLIENTE NO TIENE PAQUETE ASOCIADO
    constructor(unaId) {
      super();
      this.identificador = unaId;
    }
    puedeHacerlo(cuenta) {
      return this.identificador === cuenta.mostrarPaquete();//SE COMPARA UNA CUENTA VACIA CON EL THIS.ID PARA VERIFICAR QUE NO TIENE PAQUETE ASOCIADO
    }                                                      //EN TAL CASO PUEDE CONTRATAR PAQUETE
  }
  
  module.exports = {//INDICA QUE CLASES SERAN EXPORTADAS PARA SER USADAS EN TESTS POR EJEMPLO
    Compania, Paquete, Cliente, Cuenta, SistemaExterno, HistorialDeConsumos, ContratarPaquete, ReglasContratarPaquete, ClienteSaldoSuficiente, ClienteSinPaqueteContratado
  };

















