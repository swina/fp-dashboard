const reservations = {
    state : {
        months: ['Gennaio','Febbraio','Marzo','Aprile','Maggio','Giugno','Luglio','Agosto','Settembre','Ottobre','Novembre','Dicembre'],
        days: [ 'Dom' , 'Lun' , 'Mar' , 'Mer' , 'Gio' , 'Ven' , 'Sab' ],
        currentDate: null,
        currentTime: null,
        currentName: '',
        currentSlice:0,
        slices:[null,null,null,null,null,null,null,null],
        reservations:null,
        orders: null,
        period: [ new Date() , new Date() ]
    },
    mutations: {
        currentDate(state,date){
            state.currentDate = date
        },
        currentTime(state,time){
            state.currentTime = time
        },
        currentName(state,name){
            state.currentName = name
        },
        currentSlice(state,slice){
            state.currentSlice = slice
        },
        slices(state,slices){
            state.slices = slices
        },
        reservations(state,reservations){
            state.reservations = reservations
        },
        orders ( state , orders ){
            state.orders = orders
        },
        period( state , period ){
            state.period = period
        },
    },
    actions: {
        SetCurrentDate({commit},date){
            commit ( 'currentDate' , date )
        },
        SetCurrentTime({commit},time){
            commit ( 'currentTime' , time )
        },
        SetCurrentName({commit},name){
            commit ( 'currentName' , name )
        },
        SetCurrentSlice({commit},slice){
            commit ( 'currentSlice' , slice )
        },
        SetSlices({commit},slices){
            commit ( 'slices' , slices )
        },
        SetReservations ( { commit } , reservations ){
            commit ( 'reservations' , reservations )
        },
        SetOrders ( { commit } , orders ){
            commit ( 'orders' , orders )
        },
        SetPeriod ( { commit } , period ){
            commit ( 'period' , period )
        }
    }

}
export default reservations