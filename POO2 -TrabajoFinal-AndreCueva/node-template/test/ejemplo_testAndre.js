const { suite, test, assert, before } = require('@pmoo/testy');
const { Compania, Paquete, Cliente, Cuenta, SistemaExterno, HistorialDeConsumos, ContratarPaquete, ReglasContratarPaquete, ClienteSaldoSuficiente, ClienteSinPaqueteContratado } = require('../src/ejemploAndre');


suite('suite de ejemplo de Compania Telefonica', () => {
    let paquete1,paquete2,paquete3,paquete4;
    let ConsumosGeneralesHistorial,FiltradoDeHistorial,telefonica;
    let cliente,cuenta,listaReglasParaContratarPaquete;
    let costoMenorAlSaldo, cuentaConSaldo, cuentaCero,fechaActual;


    before(() =>{
        telefonica=new Compania();
        cliente=new Cliente(222,'alejandra');
        cuenta=new Cuenta();
        paquete1=new Paquete(1,5500,600,31,400,'');
        paquete2=new Paquete(2,1000,222,15,250,'');
        paquete3=new Paquete(3,5000,300,7,300,'');
        paquete4=new Paquete(4,6000,700,15,550,'Whatsapp');
        listaReglasParaContratarPaquete=new ContratarPaquete();
        fechaActual=new Date();
        ConsumosGeneralesHistorial=new HistorialDeConsumos();
        FiltradoDeHistorial=new HistorialDeConsumos();

    });

    test('1- Cliente con numero 222, es cliente de la compania Telefonica', () => {
        assert.isTrue(telefonica.mostrarClientes().includes(cliente.mostrarNumeroTelefono()));
    });
    test('2- Cuenta aleatoria con saldo nulo', () => {
        assert.that(cuenta.mostrarSaldo()).isEqualTo(0);
    });
    test('3- Cuenta del cliente,recargado $1000 pesos al saldo', () => {
        cliente.cargarSaldo(700);
        assert.that(cliente.mostrarNombre()).isEqualTo('alejandra');
        assert.that(cliente.mostrarCuenta().mostrarSaldo()).isEqualTo(700);
    });
    test('4- Cliente contrata paquete 2 cambian los datos de su cuenta', () => {
        cliente.cargarSaldo(700);
        cuentaCero=ReglasContratarPaquete.clienteSinPaqueteContratado(0);
        listaReglasParaContratarPaquete.inicioConfiguracion(cuentaCero);//SE REALIZA PARA LUEGO REVISAR EN REGLASPARAOBTENERPAQUETE
        cliente.contratarPaquete(listaReglasParaContratarPaquete,paquete2,cuenta,'si',fechaActual);
        assert.that(cliente.mostrarCuenta().mostrarSaldo()).isEqualTo(450);
        assert.that(cliente.mostrarCuenta().mostrarPaquete()).isEqualTo(2);
    });
    test('5- No puede contratar no tiene saldo', () => {
        costoMenorAlSaldo=cliente.mostrarCuenta().mostrarSaldo()>= paquete1.mostrarCosto();
        cuentaConSaldo=ReglasContratarPaquete.clienteconSaldoSuficiente(costoMenorAlSaldo);
        listaReglasParaContratarPaquete.inicioConfiguracion(cuentaConSaldo);
        assert.isFalse(listaReglasParaContratarPaquete.puedeContratar(cliente.mostrarCuenta()));
    });
    test('6- Cliente sin saldo, no puede contratar', () => {
        costoMenorAlSaldo =cliente.mostrarCuenta().mostrarSaldo()>=paquete1.mostrarCosto();
        cuentaConSaldo=ReglasContratarPaquete.clienteconSaldoSuficiente(costoMenorAlSaldo);
        listaReglasParaContratarPaquete.inicioConfiguracion(cuentaConSaldo);
        assert.that(() => cliente.contratarPaquete(listaReglasParaContratarPaquete, paquete1, cuenta)).raises('NO PODES CONTRATAR');
    });
    test('7- Cliente puede contratar paquete, si no posee ninguno', () => {
        cuentaCero=ReglasContratarPaquete.clienteSinPaqueteContratado(0);
        listaReglasParaContratarPaquete.inicioConfiguracion(cuentaCero);
        assert.isTrue(listaReglasParaContratarPaquete.puedeContratar(cliente.mostrarCuenta()));
    });
    test('8- CLiente tiene un paquete, por lo tanto no puede contratar', () => {
        cuentaCero=ReglasContratarPaquete.clienteSinPaqueteContratado(0);
        listaReglasParaContratarPaquete.inicioConfiguracion(cuentaCero);
        cliente.cambiarPaqueteActual(3);
        assert.isFalse(listaReglasParaContratarPaquete.puedeContratar(cliente.mostrarCuenta()));
    });
    test('9- Cliente tiene renovacion automatica situacion actualmente, pero habia puesto modo avion en febrero', () => {
        const mesFeberoInicio=new Date(2020,1,01,00,00,00);
        const consumoMB=5500;
        const consumoMinutos=600;
        cliente.cargarSaldo(1000);
        cuentaCero=ReglasContratarPaquete.clienteSinPaqueteContratado(0);
        listaReglasParaContratarPaquete.inicioConfiguracion(cuentaCero);
        cliente.contratarPaquete(listaReglasParaContratarPaquete,paquete1,cuenta,'si',mesFeberoInicio);
        telefonica.descontar(consumoMB,consumoMinutos,paquete1);
        assert.that(()=> telefonica.paqueteRenovar(cliente,listaReglasParaContratarPaquete,paquete1,'si',fechaActual)).doesNotRaise('NO PODES CONTRATAR');
    });
    test('10- Cliente compra paquete y consume datos y minutos de su paquete', () => {
        cliente.cargarSaldo(1000);
        const consumoMB2=500;
        const consumoMinutos2=20;
        cuentaCero= ReglasContratarPaquete.clienteSinPaqueteContratado(0);
        listaReglasParaContratarPaquete.inicioConfiguracion(cuentaCero);
        cliente.contratarPaquete(listaReglasParaContratarPaquete,paquete2,cuenta);
        telefonica.descontar(consumoMB2,consumoMinutos2,paquete2);
        assert.that(paquete2.mostrarDatosMinutos()).isEqualTo(202);
        assert.that(paquete2.mostrarDatosMoviles()).isEqualTo(500);
    });
    test('11- Cliente compra paquete pero quiere consumir mas de lo que debe con lo cual lanza un throw', () => {
        cliente.cargarSaldo(700);
        const primerconsumoMB=200;
        const segundoconsumoMB=400;
        const consumoMinutosiempre=100;
        const tercerconsumoMB=7000;
        cuentaCero=ReglasContratarPaquete.clienteSinPaqueteContratado(0);
        listaReglasParaContratarPaquete.inicioConfiguracion(cuentaCero);
        cliente.contratarPaquete(listaReglasParaContratarPaquete,paquete1,cuenta);
        telefonica.descontar(primerconsumoMB,consumoMinutosiempre,paquete1);
        telefonica.descontar(segundoconsumoMB,consumoMinutosiempre,paquete1);
        assert.that(()=>telefonica.descontar(tercerconsumoMB,consumoMinutosiempre,paquete1)).raises('GB O MINUTOS NO DISPONIBLES');
    });
    test('12- Historial tomando un rango de fechas y luego se ordena', () => {
        let Febrero2020,Enero2020,Mayo2020;
        let consumoEnero2020,consumoFebrero2020,consumoMayo2020,consumoMayo2020App;
        consumoMayo2020App=4000;
        Febrero2020=new Date(2020,1,02,00,00,00);
        Enero2020=new Date(2020,0,05,00,00,00);
        Mayo2020=new Date(2020,4,08,00,00,00);
        consumoFebrero2020=new SistemaExterno(222,7000,300,Febrero2020,Febrero2020);
        consumoEnero2020=new SistemaExterno(222,2000,1000,Enero2020,Enero2020);
        consumoMayo2020=new SistemaExterno(222,10000,0,Mayo2020,Mayo2020,consumoMayo2020App);
        ConsumosGeneralesHistorial.agregarConsumoHistorial(consumoMayo2020);
        ConsumosGeneralesHistorial.agregarConsumoHistorial(consumoEnero2020);
        ConsumosGeneralesHistorial.agregarConsumoHistorial(consumoFebrero2020);
        FiltradoDeHistorial.filtrar(ConsumosGeneralesHistorial.mostrarEntreEstasFechas(Febrero2020,Mayo2020));
        FiltradoDeHistorial.mostrarOrdenPorFechas();
        assert.isTrue(FiltradoDeHistorial.mostrarRegistro().first()==consumoMayo2020);
        assert.isTrue(FiltradoDeHistorial.mostrarRegistro().last()==consumoFebrero2020);
    });
    test('13- Historial ordenado por la fecha mas cercana a la actual', () => {
        let Febrero2020,Enero2020,Mayo2020;
        let consumoEnero2020,consumoFebrero2020,consumoMayo2020;
        Febrero2020=new Date(2020,01,02,00,00,00);
        Enero2020=new Date(2020,00,05,00,00,00);
        Mayo2020=new Date(2020,04,08,00,00,00);
        consumoFebrero2020=new SistemaExterno(222,7000,300,Febrero2020,Febrero2020);
        consumoEnero2020=new SistemaExterno(222,2000,1000,Enero2020,Enero2020);
        consumoMayo2020=new SistemaExterno(222,10000,0,Mayo2020,Mayo2020);
        ConsumosGeneralesHistorial.agregarConsumoHistorial(consumoMayo2020);
        ConsumosGeneralesHistorial.agregarConsumoHistorial(consumoEnero2020);
        ConsumosGeneralesHistorial.agregarConsumoHistorial(consumoFebrero2020);
        ConsumosGeneralesHistorial.mostrarOrdenPorFechas();
        assert.isTrue(ConsumosGeneralesHistorial.mostrarRegistro().first()==consumoMayo2020);
        assert.isTrue(ConsumosGeneralesHistorial.mostrarRegistro().last()==consumoEnero2020);
    });
    test('14- Cliente consume todo el paquete, con lo cual el paquete esta agotado', () => {
        cliente.cargarSaldo(1000);
        const MBCONSUMI=5000;
        const MinutosConsumi=300;
        cuentaCero=ReglasContratarPaquete.clienteSinPaqueteContratado(0);
        listaReglasParaContratarPaquete.inicioConfiguracion(cuentaCero);
        cliente.contratarPaquete(listaReglasParaContratarPaquete,paquete3,cuenta);
        telefonica.descontar(MBCONSUMI,MinutosConsumi,paquete3);
        assert.isTrue(paquete3.agotado());
    });
    test('15- Cliente quiere consumir paquete pero esta vencido el paquete', () => {
        let ExpiracionJulio2020,Mayo2020,hoy;
        Mayo2020=new Date(2020,04,01,13,30,00);
        ExpiracionJulio2020=new Date();
        hoy=new Date(2020,07,30,00,00,00);
        cliente.cargarSaldo(1000);
        cuentaCero=ReglasContratarPaquete.clienteSinPaqueteContratado(0);
        listaReglasParaContratarPaquete.inicioConfiguracion(cuentaCero);
        cliente.contratarPaquete(listaReglasParaContratarPaquete,paquete1,cuenta,'no',Mayo2020);
        
        ExpiracionJulio2020.setDate((cliente.mostrarCuenta().mostrarFechaContratadoPaquete()).getDate()+paquete1.mostrarTiempoDeDuracion());
        assert.isTrue(paquete1.vencido(hoy,ExpiracionJulio2020));
     });
    test('16- Cliente quiere consumir paquete y el paquete sigue vigente', () => {
        let julio2020,expiracionAgosto2020,hoy;
        julio2020=new Date(2020,06,01,00,00,00);
        cliente.cargarSaldo(2000);
        cuentaCero=ReglasContratarPaquete.clienteSinPaqueteContratado(0);
        listaReglasParaContratarPaquete.inicioConfiguracion(cuentaCero);
        cliente.contratarPaquete(listaReglasParaContratarPaquete,paquete1,cuenta,'no',julio2020);
        expiracionAgosto2020=new Date();
        hoy=new Date(2020,06,21,00,00,00);
        expiracionAgosto2020.setDate(cliente.mostrarCuenta().mostrarFechaContratadoPaquete()+paquete1.mostrarTiempoDeDuracion());
        assert.isFalse(paquete1.vencido(hoy,expiracionAgosto2020));
    });
    test('17- Cliente compra Paquete especial con APP ilimitada consume datos de APP,aun con datosmoviles y minutos disponibles', () => {
        cliente.cargarSaldo(800);
        let julio2020;
        const MBusados=100;
        const Minutosusados=10;
        const MBApp=1000;
        julio2020=new Date(2020,06,02,00,00,00);
        cuentaCero=ReglasContratarPaquete.clienteSinPaqueteContratado(0);
        listaReglasParaContratarPaquete.inicioConfiguracion(cuentaCero);
        cliente.contratarPaquete(listaReglasParaContratarPaquete,paquete4,cuenta,'no',julio2020);
        telefonica.descontar(MBusados,Minutosusados,paquete4,MBApp);
        assert.isFalse(paquete4.agotado());
        assert.that(paquete4.mostrarDatosMovilesApp()).isEqualTo(1000);
        assert.that(paquete4.mostrarNombreApp()).isEqualTo('Whatsapp');
    });
    test('18- Cliente compra Paquete especia,gasta todo gasta mb y minutos pero la APP es ilimitada. Consumo de la app',()=>{
        cliente.cargarSaldo(1000);
        let julio2020;
        const MBusados=6000;
        const Minutosusados=700;
        const MBApp=1500;
        julio2020=new Date(2020,06,02,00,00,00);
        cuentaCero=ReglasContratarPaquete.clienteSinPaqueteContratado(0);
        listaReglasParaContratarPaquete.inicioConfiguracion(cuentaCero);
        cliente.contratarPaquete(listaReglasParaContratarPaquete,paquete4,cuenta,'no',julio2020);
        telefonica.descontar(MBusados,Minutosusados,paquete4,MBApp);
        assert.isFalse(paquete4.agotado());
        assert.that(paquete4.mostrarDatosMovilesApp()).isEqualTo(1500);
    });
});
