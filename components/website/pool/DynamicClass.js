// import CharacterActuarial from "components/game/characters/CharacterActuarial";
// import CharacterClaims from "components/game/characters/CharacterClaims";



class DynamicClass {
    constructor(className, opts) {
        return new DynamicClass.classes[className](opts);

    }

    static classes = {
        // CharacterActuarial,
        // CharacterClaims,
    };
}

export default DynamicClass;