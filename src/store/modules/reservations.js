const reservations = {
    state : {
        months: ['Gennaio','Febbraio','Marzo','Aprile','Maggio','Giugno','Luglio','Agosto','Settembre','Ottobre','Novembre','Dicembre'],
        currentDate: null,
        currentTime: null,
        currentName: '',
        currentSlice:0,
        slices:[null,null,null,null,null,null,null,null],
        reservations:null
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
        }
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
        }
    }

}
export default reservations