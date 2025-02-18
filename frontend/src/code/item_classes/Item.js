export default class Item{
    constructor(app, itemType, player){
        this.app = app
        //itemType either 1)weapon 2)armor 3)consumable 4)materialw
        this.itemType = itemType
        this.player = player
    }
}