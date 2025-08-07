// Données de démonstration – étendez selon vos besoins
const charactersData = {
    wallace_uchiha: {
        key:'wallace_uchiha',
        name: 'Wallace Uchiha',
        quote: '« Une invention par jour éloigne l\'ennui pour toujours ! »',
        village: 'Konohagakure',
        grade: 'Inventeur',
        specialty: 'Génie mécanique',
        relations: 'Gromit (partenaire)',
        kekkei: '???',
        clan: 'Uchiha',
        bio: `Inventeur de génie passionné par le fromage, Wallace Uchiha parcourt le monde ninja pour perfectionner ses machines les plus farfelues. Son héritage Uchiha lui confère un potentiel immense, même s'il préfère se concentrer sur ses inventions plutôt que sur les techniques de combat traditionnelles.`,
        portrait: 'img/wallace_uchiha.jpg',
        emblem: 'img/solve logo.png'
    },
    gromit_uzumaki: {
        key:'gromit_uzumaki',
        name: 'Gromit Uzumaki',
        quote: '« … »',
        village: 'Konohagakure',
        grade: 'Chien Ninja',
        specialty: 'Analyse tactique',
        relations: 'Wallace Uchiha (partenaire)',
        kekkei: '???',
        clan: 'Uzumaki',
        bio: `Compagnon silencieux mais brillant, Gromit protège Wallace Uchiha et élabore souvent les plans qui sauvent la mise. Sa loyauté envers son maître est absolue, et ses capacités tactiques compensent largement son manque de parole.`,
        portrait: 'img/gromit_uzumaki.jpg',
        emblem: 'img/solve logo.png'
    }
};

function loadCharacter() {
    const params = new URLSearchParams(window.location.search);
    const key = params.get('character');
    const char = charactersData[key];
    if (!char) return;

    document.getElementById('characterName').textContent = char.name;
    document.getElementById('characterQuote').textContent = char.quote;
    document.getElementById('villageField').textContent = char.village;
    document.getElementById('gradeField').textContent = char.grade;
    document.getElementById('kekkeiField').textContent = char.kekkei || '???';

    // Clan affiché seulement si présent
    const clanBlock = document.getElementById('clanBlock');
    if (char.clan) {
        document.getElementById('clanField').textContent = char.clan;
        clanBlock.style.display = 'block';
    } else {
        clanBlock.style.display = 'none';
    }

    document.getElementById('bioText').textContent = char.bio;
    document.getElementById('portraitImg').src = char.portrait;
    document.getElementById('emblemImg').src = char.emblem;

    // lien vers page clan
    if (char.clan) {
        document.getElementById('clanField').addEventListener('click',()=>{
            window.location.href = `clan-detail.html?clan=${char.clan.toLowerCase()}`;
        });
    }
}

document.addEventListener('DOMContentLoaded', loadCharacter);
