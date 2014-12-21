(function() {
	var app = angular.module('wizard', ['ui.bootstrap', 'checklist-model']);

	app.controller('WizardController', ['$http', 'modalService',
	function($http, modalService) {

		var me = this;

		me.wizard = [];
		me.currentWindow = [];
		me.solution = {};
		me.userSequence = [];
		me.solution.selectedOptions = [];
		me.computedAttr_name = "";
		me.seqNextNavegation = [];

		$http.get('/def/definition_auction').success(function(data) {
		//$http.get('generate/http%3A%2F%2Fwww.semanticweb.org%2Fmilena%2Fontologies%2F2013%2F6%2Fauction').success(function(data) {
			me.wizard = data;

			me.currentWindow = me.wizard.windows[0];

			me.solution = {
				selectedOption : 0,
				selectedProperties : [5, 0, 1],
				selectedOptions : [],
				mainClass : "it is not used"
			};

			me.userSequence = [];
			/* length = me.currentWindow.propertySets ? me.currentWindow.propertySets[me.solution.selectedOption].length : 0;
			 me.solution.selectedOptions = [length]; */

			for ( i = 0; i < 5; i++) {
				me.solution.selectedOptions[i] = 0;
			}
		});

		me.example = {
			"definition" : [{
				"propertyName" : "nomeCategoria",
				"domain" : ["Categoria"],
				"range" : ["string"]
			}, {
				"propertyName" : "nomeLeilao",
				"domain" : ["Leilao"],
				"range" : ["string"]
			}, {
				"propertyName" : "temProduto",
				"domain" : ["Leilao"],
				"range" : ["Produto"]
			}, {
				"propertyName" : "temVendedor",
				"domain" : ["Leilao"],
				"range" : ["Vendedor"]
			}, {
				"propertyName" : "dataFim",
				"domain" : ["Leilao"],
				"range" : ["string"]
			}, {
				"propertyName" : "dataInicio",
				"domain" : ["Leilao"],
				"range" : ["string"]
			}, {
				"propertyName" : "difMin",
				"domain" : ["Leilao"],
				"range" : ["string"]
			}, {
				"propertyName" : "estadoProduto",
				"domain" : ["Leilao"],
				"range" : ["string"]
			}, {
				"propertyName" : "lanceMin",
				"domain" : ["Leilao"],
				"range" : ["string"]
			}, {
				"propertyName" : "nomeProduto",
				"domain" : ["Produto"],
				"range" : ["string"]
			}, {
				"propertyName" : "categoria",
				"domain" : ["Produto"],
				"range" : ["Categoria"]
			}, {
				"propertyName" : "dataCadastro",
				"domain" : ["Produto"],
				"range" : ["string"]
			}, {
				"propertyName" : "descricaoProduto",
				"domain" : ["Produto"],
				"range" : ["string"]
			}, {
				"propertyName" : "estaEmLeilao",
				"domain" : ["Produto"],
				"range" : ["string"]
			}, {
				"propertyName" : "quantidade",
				"domain" : ["Produto"],
				"range" : ["string"]
			}, {
				"propertyName" : "nomeUsuario",
				"domain" : ["Usuario"],
				"range" : ["string"]
			}, {
				"propertyName" : "email",
				"domain" : ["Usuario"],
				"range" : ["string"]
			}, {
				"propertyName" : "dataMembroDesde",
				"domain" : ["Vendedor"],
				"range" : ["string"]
			}, {
				"propertyName" : "qualificacao",
				"domain" : ["Vendedor"],
				"range" : ["string"]
			}, {
				"propertyName" : "temConcorrente",
				"domain" : ["Lance"],
				"range" : ["Concorrente"]
			}, {
				"propertyName" : "temLeilao",
				"domain" : ["Lance"],
				"range" : ["Leilao"]
			}, {
				"propertyName" : "timeStamp",
				"domain" : ["Lance"],
				"range" : ["string"]
			}, {
				"propertyName" : "valor",
				"domain" : ["Lance"],
				"range" : ["string"]
			}],
			"triples" : [{
				"subject" : "audio",
				"predicate" : "type",
				"object" : "Resource"
			}, {
				"subject" : "audio",
				"predicate" : "type",
				"object" : "Categoria"
			}, {
				"subject" : "audio",
				"predicate" : "type",
				"object" : "NamedIndividual"
			}, {
				"subject" : "audio",
				"predicate" : "label",
				"object" : "Audio"
			}, {
				"subject" : "audio",
				"predicate" : "nomeCategoria",
				"object" : "Audio"
			}, {
				"subject" : "Resource",
				"predicate" : "type",
				"object" : "Class"
			}, {
				"subject" : "Resource",
				"predicate" : "type",
				"object" : "Resource"
			}, {
				"subject" : "Resource",
				"predicate" : "subClassOf",
				"object" : "Resource"
			}, {
				"subject" : "Class",
				"predicate" : "type",
				"object" : "Class"
			}, {
				"subject" : "Class",
				"predicate" : "type",
				"object" : "Resource"
			}, {
				"subject" : "Class",
				"predicate" : "subClassOf",
				"object" : "Class"
			}, {
				"subject" : "Class",
				"predicate" : "subClassOf",
				"object" : "Resource"
			}, {
				"subject" : "Categoria",
				"predicate" : "type",
				"object" : "Class"
			}, {
				"subject" : "Categoria",
				"predicate" : "type",
				"object" : "Resource"
			}, {
				"subject" : "Categoria",
				"predicate" : "subClassOf",
				"object" : "Resource"
			}, {
				"subject" : "Categoria",
				"predicate" : "subClassOf",
				"object" : "Categoria"
			}, {
				"subject" : "Categoria",
				"predicate" : "label",
				"object" : "Categoria"
			}, {
				"subject" : "NamedIndividual",
				"predicate" : "type",
				"object" : "Class"
			}, {
				"subject" : "NamedIndividual",
				"predicate" : "type",
				"object" : "Resource"
			}, {
				"subject" : "NamedIndividual",
				"predicate" : "subClassOf",
				"object" : "Resource"
			}, {
				"subject" : "NamedIndividual",
				"predicate" : "subClassOf",
				"object" : "NamedIndividual"
			}, {
				"subject" : "informatica",
				"predicate" : "type",
				"object" : "Resource"
			}, {
				"subject" : "informatica",
				"predicate" : "type",
				"object" : "Categoria"
			}, {
				"subject" : "informatica",
				"predicate" : "type",
				"object" : "NamedIndividual"
			}, {
				"subject" : "informatica",
				"predicate" : "label",
				"object" : "Informatica"
			}, {
				"subject" : "informatica",
				"predicate" : "nomeCategoria",
				"object" : "Informatica"
			}, {
				"subject" : "cine_e_foto",
				"predicate" : "type",
				"object" : "Resource"
			}, {
				"subject" : "cine_e_foto",
				"predicate" : "type",
				"object" : "Categoria"
			}, {
				"subject" : "cine_e_foto",
				"predicate" : "type",
				"object" : "NamedIndividual"
			}, {
				"subject" : "cine_e_foto",
				"predicate" : "label",
				"object" : "Cine e Foto"
			}, {
				"subject" : "cine_e_foto",
				"predicate" : "nomeCategoria",
				"object" : "Cine e Foto"
			}, {
				"subject" : "tablets",
				"predicate" : "type",
				"object" : "Resource"
			}, {
				"subject" : "tablets",
				"predicate" : "type",
				"object" : "Categoria"
			}, {
				"subject" : "tablets",
				"predicate" : "type",
				"object" : "NamedIndividual"
			}, {
				"subject" : "tablets",
				"predicate" : "label",
				"object" : "Tablets"
			}, {
				"subject" : "tablets",
				"predicate" : "nomeCategoria",
				"object" : "Tablets"
			}, {
				"subject" : "leilao1",
				"predicate" : "type",
				"object" : "Resource"
			}, {
				"subject" : "leilao1",
				"predicate" : "type",
				"object" : "Leilao"
			}, {
				"subject" : "leilao1",
				"predicate" : "type",
				"object" : "NamedIndividual"
			}, {
				"subject" : "leilao1",
				"predicate" : "label",
				"object" : "leilao 1"
			}, {
				"subject" : "leilao1",
				"predicate" : "nomeLeilao",
				"object" : "leilao 1"
			}, {
				"subject" : "leilao1",
				"predicate" : "temProduto",
				"object" : "MP4_Watch_Play_NewLink_PM101"
			}, {
				"subject" : "leilao1",
				"predicate" : "temVendedor",
				"object" : "vendedor1"
			}, {
				"subject" : "leilao1",
				"predicate" : "dataFim",
				"object" : "2012/02/20"
			}, {
				"subject" : "leilao1",
				"predicate" : "dataInicio",
				"object" : "2012/02/01"
			}, {
				"subject" : "leilao1",
				"predicate" : "difMin",
				"object" : "5"
			}, {
				"subject" : "leilao1",
				"predicate" : "estadoProduto",
				"object" : "30.00 USPS Priority Mail International \nInternational items may be subject to customs processing and additional charges.  \n \nItem location:\nPasadena, California, United States\n \nShips to:\nWorldwide"
			}, {
				"subject" : "leilao1",
				"predicate" : "estadoProduto",
				"object" : "novo"
			}, {
				"subject" : "leilao1",
				"predicate" : "lanceMin",
				"object" : "23"
			}, {
				"subject" : "Leilao",
				"predicate" : "type",
				"object" : "Class"
			}, {
				"subject" : "Leilao",
				"predicate" : "type",
				"object" : "Resource"
			}, {
				"subject" : "Leilao",
				"predicate" : "subClassOf",
				"object" : "Resource"
			}, {
				"subject" : "Leilao",
				"predicate" : "subClassOf",
				"object" : "Leilao"
			}, {
				"subject" : "Leilao",
				"predicate" : "label",
				"object" : "Leilao"
			}, {
				"subject" : "MP4_Watch_Play_NewLink_PM101",
				"predicate" : "type",
				"object" : "Resource"
			}, {
				"subject" : "MP4_Watch_Play_NewLink_PM101",
				"predicate" : "type",
				"object" : "Produto"
			}, {
				"subject" : "MP4_Watch_Play_NewLink_PM101",
				"predicate" : "type",
				"object" : "NamedIndividual"
			}, {
				"subject" : "MP4_Watch_Play_NewLink_PM101",
				"predicate" : "label",
				"object" : "MP4 Watch Play NewLink PM101"
			}, {
				"subject" : "MP4_Watch_Play_NewLink_PM101",
				"predicate" : "nomeProduto",
				"object" : "MP4 Watch Play NewLink PM101"
			}, {
				"subject" : "MP4_Watch_Play_NewLink_PM101",
				"predicate" : "categoria",
				"object" : "audio"
			}, {
				"subject" : "MP4_Watch_Play_NewLink_PM101",
				"predicate" : "dataCadastro",
				"object" : "12/10/2012"
			}, {
				"subject" : "MP4_Watch_Play_NewLink_PM101",
				"predicate" : "descricaoProduto",
				"object" : "MP4 Watch Play NewLink PM101 Prata com Pulseira Relogio Preta, Radio FM, Gravador de Audio e Slot para Cartao"
			}, {
				"subject" : "MP4_Watch_Play_NewLink_PM101",
				"predicate" : "estaEmLeilao",
				"object" : "1"
			}, {
				"subject" : "MP4_Watch_Play_NewLink_PM101",
				"predicate" : "quantidade",
				"object" : "23"
			}, {
				"subject" : "Produto",
				"predicate" : "type",
				"object" : "Class"
			}, {
				"subject" : "Produto",
				"predicate" : "type",
				"object" : "Resource"
			}, {
				"subject" : "Produto",
				"predicate" : "subClassOf",
				"object" : "Resource"
			}, {
				"subject" : "Produto",
				"predicate" : "subClassOf",
				"object" : "Produto"
			}, {
				"subject" : "Produto",
				"predicate" : "label",
				"object" : "Produto"
			}, {
				"subject" : "vendedor1",
				"predicate" : "type",
				"object" : "Resource"
			}, {
				"subject" : "vendedor1",
				"predicate" : "type",
				"object" : "Usuario"
			}, {
				"subject" : "vendedor1",
				"predicate" : "type",
				"object" : "Vendedor"
			}, {
				"subject" : "vendedor1",
				"predicate" : "type",
				"object" : "NamedIndividual"
			}, {
				"subject" : "vendedor1",
				"predicate" : "label",
				"object" : "Vendedor 1"
			}, {
				"subject" : "vendedor1",
				"predicate" : "nomeUsuario",
				"object" : "Vendedor 1"
			}, {
				"subject" : "vendedor1",
				"predicate" : "dataMembroDesde",
				"object" : "1/01/2005"
			}, {
				"subject" : "vendedor1",
				"predicate" : "email",
				"object" : "vendedor1@gmail.com"
			}, {
				"subject" : "vendedor1",
				"predicate" : "qualificacao",
				"object" : "1"
			}, {
				"subject" : "Usuario",
				"predicate" : "type",
				"object" : "Class"
			}, {
				"subject" : "Usuario",
				"predicate" : "type",
				"object" : "Resource"
			}, {
				"subject" : "Usuario",
				"predicate" : "subClassOf",
				"object" : "Resource"
			}, {
				"subject" : "Usuario",
				"predicate" : "subClassOf",
				"object" : "Usuario"
			}, {
				"subject" : "Vendedor",
				"predicate" : "type",
				"object" : "Class"
			}, {
				"subject" : "Vendedor",
				"predicate" : "type",
				"object" : "Resource"
			}, {
				"subject" : "Vendedor",
				"predicate" : "subClassOf",
				"object" : "Resource"
			}, {
				"subject" : "Vendedor",
				"predicate" : "subClassOf",
				"object" : "Usuario"
			}, {
				"subject" : "Vendedor",
				"predicate" : "subClassOf",
				"object" : "Vendedor"
			}, {
				"subject" : "leilao2",
				"predicate" : "type",
				"object" : "Resource"
			}, {
				"subject" : "leilao2",
				"predicate" : "type",
				"object" : "Leilao"
			}, {
				"subject" : "leilao2",
				"predicate" : "type",
				"object" : "NamedIndividual"
			}, {
				"subject" : "leilao2",
				"predicate" : "label",
				"object" : "leilao 2"
			}, {
				"subject" : "leilao2",
				"predicate" : "nomeLeilao",
				"object" : "leilao 2"
			}, {
				"subject" : "leilao2",
				"predicate" : "temProduto",
				"object" : "MP4_Watch_Play_NewLink_PM101"
			}, {
				"subject" : "leilao2",
				"predicate" : "temVendedor",
				"object" : "vendedor2"
			}, {
				"subject" : "leilao2",
				"predicate" : "dataFim",
				"object" : "2012/12/25"
			}, {
				"subject" : "leilao2",
				"predicate" : "dataInicio",
				"object" : "2012/10/04"
			}, {
				"subject" : "leilao2",
				"predicate" : "difMin",
				"object" : "25"
			}, {
				"subject" : "leilao2",
				"predicate" : "estadoProduto",
				"object" : "novo"
			}, {
				"subject" : "leilao2",
				"predicate" : "infoFrete",
				"object" : "30.00 USPS Priority Mail International\nInternational items may be subject to customs processing and additional charges.  \n \nItem location:\nPasadena, California, United States\n \nShips to:\nWorldwide"
			}, {
				"subject" : "leilao2",
				"predicate" : "lanceMin",
				"object" : "45"
			}, {
				"subject" : "vendedor2",
				"predicate" : "type",
				"object" : "Resource"
			}, {
				"subject" : "vendedor2",
				"predicate" : "type",
				"object" : "Usuario"
			}, {
				"subject" : "vendedor2",
				"predicate" : "type",
				"object" : "Vendedor"
			}, {
				"subject" : "vendedor2",
				"predicate" : "type",
				"object" : "NamedIndividual"
			}, {
				"subject" : "vendedor2",
				"predicate" : "label",
				"object" : "Vendedor 2"
			}, {
				"subject" : "vendedor2",
				"predicate" : "nomeUsuario",
				"object" : "Vendedor 2"
			}, {
				"subject" : "vendedor2",
				"predicate" : "dataMembroDesde",
				"object" : "2/04/2008"
			}, {
				"subject" : "vendedor2",
				"predicate" : "email",
				"object" : "vendedor2@yahoo.com"
			}, {
				"subject" : "vendedor2",
				"predicate" : "qualificacao",
				"object" : "3"
			}, {
				"subject" : "leilao10",
				"predicate" : "type",
				"object" : "Resource"
			}, {
				"subject" : "leilao10",
				"predicate" : "type",
				"object" : "Leilao"
			}, {
				"subject" : "leilao10",
				"predicate" : "type",
				"object" : "NamedIndividual"
			}, {
				"subject" : "leilao10",
				"predicate" : "label",
				"object" : "leilao 10"
			}, {
				"subject" : "leilao10",
				"predicate" : "nomeLeilao",
				"object" : "leilao 10"
			}, {
				"subject" : "leilao10",
				"predicate" : "temProduto",
				"object" : "produto1"
			}, {
				"subject" : "leilao10",
				"predicate" : "temVendedor",
				"object" : "vendedor2"
			}, {
				"subject" : "leilao10",
				"predicate" : "dataFim",
				"object" : "2012/09/10"
			}, {
				"subject" : "leilao10",
				"predicate" : "dataInicio",
				"object" : "2012/04/04"
			}, {
				"subject" : "leilao10",
				"predicate" : "difMin",
				"object" : "5"
			}, {
				"subject" : "leilao10",
				"predicate" : "infoFrete",
				"object" : "frete gratis"
			}, {
				"subject" : "leilao10",
				"predicate" : "lanceMin",
				"object" : "45"
			}, {
				"subject" : "produto1",
				"predicate" : "type",
				"object" : "Resource"
			}, {
				"subject" : "produto1",
				"predicate" : "type",
				"object" : "Produto"
			}, {
				"subject" : "produto1",
				"predicate" : "type",
				"object" : "NamedIndividual"
			}, {
				"subject" : "produto1",
				"predicate" : "label",
				"object" : "Camera Samsung ST 64"
			}, {
				"subject" : "produto1",
				"predicate" : "nomeProduto",
				"object" : "Camera Samsung ST 64"
			}, {
				"subject" : "produto1",
				"predicate" : "categoria",
				"object" : "cine_e_foto"
			}, {
				"subject" : "produto1",
				"predicate" : "dataCadastro",
				"object" : "23/04/2013"
			}, {
				"subject" : "produto1",
				"predicate" : "descricaoProduto",
				"object" : "Camera Samsung ST 64 Preta c/ LCD 2.7 14,2 MP, Zoom Optico 5x, Estabilizacao de Imagem, Video em HD Foto Panoramica, Detector de Face e Sorriso"
			}, {
				"subject" : "produto1",
				"predicate" : "estaEmLeilao",
				"object" : "0"
			}, {
				"subject" : "produto1",
				"predicate" : "quantidade",
				"object" : "34"
			}, {
				"subject" : "leilao3",
				"predicate" : "type",
				"object" : "Resource"
			}, {
				"subject" : "leilao3",
				"predicate" : "type",
				"object" : "Leilao"
			}, {
				"subject" : "leilao3",
				"predicate" : "type",
				"object" : "NamedIndividual"
			}, {
				"subject" : "leilao3",
				"predicate" : "label",
				"object" : "leilao 3"
			}, {
				"subject" : "leilao3",
				"predicate" : "nomeLeilao",
				"object" : "leilao 3"
			}, {
				"subject" : "leilao3",
				"predicate" : "temProduto",
				"object" : "Home_Theater_LG_HT806ST"
			}, {
				"subject" : "leilao3",
				"predicate" : "temVendedor",
				"object" : "vendedor1"
			}, {
				"subject" : "leilao3",
				"predicate" : "dataFim",
				"object" : "2013/11/23"
			}, {
				"subject" : "leilao3",
				"predicate" : "dataInicio",
				"object" : "2012/05/01"
			}, {
				"subject" : "leilao3",
				"predicate" : "difMin",
				"object" : "100"
			}, {
				"subject" : "leilao3",
				"predicate" : "estadoProduto",
				"object" : "uso"
			}, {
				"subject" : "leilao3",
				"predicate" : "infoFrete",
				"object" : "12.15 USPS First Class Mail Intl / First Class Package Intl Service\nInternational items may be subject to customs processing and additional charges.  \n \nItem location:\nFontana, California, United States\n \nShips to:\nWorldwide See exclusions"
			}, {
				"subject" : "leilao3",
				"predicate" : "lanceMin",
				"object" : "500"
			}, {
				"subject" : "Home_Theater_LG_HT806ST",
				"predicate" : "type",
				"object" : "Resource"
			}, {
				"subject" : "Home_Theater_LG_HT806ST",
				"predicate" : "type",
				"object" : "Produto"
			}, {
				"subject" : "Home_Theater_LG_HT806ST",
				"predicate" : "type",
				"object" : "NamedIndividual"
			}, {
				"subject" : "Home_Theater_LG_HT806ST",
				"predicate" : "label",
				"object" : "Home Theater LG HT806ST"
			}, {
				"subject" : "Home_Theater_LG_HT806ST",
				"predicate" : "nomeProduto",
				"object" : "Home Theater LG HT806ST"
			}, {
				"subject" : "Home_Theater_LG_HT806ST",
				"predicate" : "categoria",
				"object" : "audio"
			}, {
				"subject" : "Home_Theater_LG_HT806ST",
				"predicate" : "dataCadastro",
				"object" : "23/05/2013"
			}, {
				"subject" : "Home_Theater_LG_HT806ST",
				"predicate" : "descricaoProduto",
				"object" : "Nada como um equipamento completo e potente o suficiente para garantir a qualidade de entretenimento ideal na sua casa. Pois o LG HT806ST e justamente o caso para quem busca um home theater capaz de agradar a todos. Com 850W RMS de potencia, ele e perfeito para transformar sua casa em uma verdadeira sala de cinema e ainda animar todas as suas festas. A tecnologia Bass Blast potencializa os sons graves de modo impressionante, enquanto o recurso Virtual Sound Matrix simula os efeitos de um sistema 10.1 canais. Alem do design elegante e que se encaixa em qualquer ambiente, o aparelho conta com elementos bastante praticos, como a funcao Ripping, que possibilita gravar qualquer CD diretamente para um pendrive. O karaoke tambem e destaque do produto e promete horas de animacao com sua familia e amigos."
			}, {
				"subject" : "Home_Theater_LG_HT806ST",
				"predicate" : "estaEmLeilao",
				"object" : "1"
			}, {
				"subject" : "Home_Theater_LG_HT806ST",
				"predicate" : "quantidade",
				"object" : "2"
			}, {
				"subject" : "78",
				"predicate" : "type",
				"object" : "Resource"
			}, {
				"subject" : "78",
				"predicate" : "type",
				"object" : "Produto"
			}, {
				"subject" : "78",
				"predicate" : "type",
				"object" : "NamedIndividual"
			}, {
				"subject" : "78",
				"predicate" : "label",
				"object" : "MP4 Player Philips SA3VBE04KX/78"
			}, {
				"subject" : "78",
				"predicate" : "nomeProduto",
				"object" : "MP4 Player Philips SA3VBE04KX/78"
			}, {
				"subject" : "78",
				"predicate" : "categoria",
				"object" : "audio"
			}, {
				"subject" : "78",
				"predicate" : "dataCadastro",
				"object" : "12/03/2012"
			}, {
				"subject" : "78",
				"predicate" : "descricaoProduto",
				"object" : "MP4 Player Philips SA3VBE04KX/78 4GB GoGear Vibe c/ Tela 1,8 e Radio FM - Preto \nTenha em maos um MP4 Player que faz de tudo, desde poder ouvir musicas em formato MP3 ou sua programacao preferida no radio FM, ate assistir videos de filmes, shows ou clipes.i\nO modelo SA3VBE possui tela de 4,6 centimetros (1,8 polegadas) e ideal para ver seus videos e ate navegar por seus menus sem dificuldades. Ele ainda vem fones emborrachados evitando que machuquem seus ouvidos.\nSeu armazenamento permite guardar centena de musicas no formato MP3, tornando assim seu dispositivo movel em um verdadeiro centro de entretenimento. E se pensa que a transferencia de musicas do seu pc/notebook para o MP4 Player e demorada, engana-se Em apenas cinco minutos e possivel transferir ate trinta musicas de uma vez, sem perda de tempo"
			}, {
				"subject" : "78",
				"predicate" : "estaEmLeilao",
				"object" : "1"
			}, {
				"subject" : "78",
				"predicate" : "quantidade",
				"object" : "12"
			}, {
				"subject" : "Monitor_LCD_LED_Samsung_23_S23B550V_Widescreen",
				"predicate" : "type",
				"object" : "Resource"
			}, {
				"subject" : "Monitor_LCD_LED_Samsung_23_S23B550V_Widescreen",
				"predicate" : "type",
				"object" : "Produto"
			}, {
				"subject" : "Monitor_LCD_LED_Samsung_23_S23B550V_Widescreen",
				"predicate" : "type",
				"object" : "NamedIndividual"
			}, {
				"subject" : "Monitor_LCD_LED_Samsung_23_S23B550V_Widescreen",
				"predicate" : "label",
				"object" : "Monitor LCD LED Samsung 23 S23B550V Widescreen"
			}, {
				"subject" : "Monitor_LCD_LED_Samsung_23_S23B550V_Widescreen",
				"predicate" : "nomeProduto",
				"object" : "Monitor LCD LED Samsung 23 S23B550V Widescreen"
			}, {
				"subject" : "Monitor_LCD_LED_Samsung_23_S23B550V_Widescreen",
				"predicate" : "categoria",
				"object" : "informatica"
			}, {
				"subject" : "Monitor_LCD_LED_Samsung_23_S23B550V_Widescreen",
				"predicate" : "dataCadastro",
				"object" : "12/4/2013"
			}, {
				"subject" : "Monitor_LCD_LED_Samsung_23_S23B550V_Widescreen",
				"predicate" : "descricaoProduto",
				"object" : "Tecnologia e eficiencia com muito estilo!\nPara voce que procura um monitor que atenda as suas expectativas, tanto para o trabalho quanto para o lazer, conheca o Samsung S23B550V e surpreenda-se!\nCom design elegante e superfino, proporciona imagens sem distorcao em diferentes angulos, mantendo a mesma qualidade original de cores.\nO Mega Contraste Dinamico e o tempo de resposta de 2ms conferem uma qualidade de imagem nunca vista antes, alem de oferecer grande conforto visual, importante para quem passa horas na frente do monitor.\nAlem disso, o S23B550V possui tecnologia de iluminacao por LED que garantem melhor performance, economia de energia e respeito ao meio ambiente. Ele ainda conta com wall-mount, alto falante embutido e tecnologia Mobile High-Definition (MHL).\nAdquira o seu monitor Samsung e acrescente mais cores em sua vida!"
			}, {
				"subject" : "Monitor_LCD_LED_Samsung_23_S23B550V_Widescreen",
				"predicate" : "estaEmLeilao",
				"object" : "1"
			}, {
				"subject" : "Monitor_LCD_LED_Samsung_23_S23B550V_Widescreen",
				"predicate" : "quantidade",
				"object" : "3"
			}, {
				"subject" : "concorrente1",
				"predicate" : "type",
				"object" : "Resource"
			}, {
				"subject" : "concorrente1",
				"predicate" : "type",
				"object" : "Usuario"
			}, {
				"subject" : "concorrente1",
				"predicate" : "type",
				"object" : "Concorrente"
			}, {
				"subject" : "concorrente1",
				"predicate" : "type",
				"object" : "NamedIndividual"
			}, {
				"subject" : "concorrente1",
				"predicate" : "label",
				"object" : "Concorrente 1"
			}, {
				"subject" : "concorrente1",
				"predicate" : "nomeUsuario",
				"object" : "Concorrente 1"
			}, {
				"subject" : "concorrente1",
				"predicate" : "email",
				"object" : "concorrente1@gmail.com"
			}, {
				"subject" : "Concorrente",
				"predicate" : "type",
				"object" : "Class"
			}, {
				"subject" : "Concorrente",
				"predicate" : "type",
				"object" : "Resource"
			}, {
				"subject" : "Concorrente",
				"predicate" : "subClassOf",
				"object" : "Resource"
			}, {
				"subject" : "Concorrente",
				"predicate" : "subClassOf",
				"object" : "Usuario"
			}, {
				"subject" : "Concorrente",
				"predicate" : "subClassOf",
				"object" : "Concorrente"
			}, {
				"subject" : "concorrente2",
				"predicate" : "type",
				"object" : "Resource"
			}, {
				"subject" : "concorrente2",
				"predicate" : "type",
				"object" : "Usuario"
			}, {
				"subject" : "concorrente2",
				"predicate" : "type",
				"object" : "Concorrente"
			}, {
				"subject" : "concorrente2",
				"predicate" : "type",
				"object" : "NamedIndividual"
			}, {
				"subject" : "concorrente2",
				"predicate" : "label",
				"object" : "Concorrente 2"
			}, {
				"subject" : "concorrente2",
				"predicate" : "nomeUsuario",
				"object" : "Concorrente 2"
			}, {
				"subject" : "concorrente2",
				"predicate" : "email",
				"object" : "concorrente2@gmail.com"
			}, {
				"subject" : "lance1",
				"predicate" : "type",
				"object" : "Resource"
			}, {
				"subject" : "lance1",
				"predicate" : "type",
				"object" : "Lance"
			}, {
				"subject" : "lance1",
				"predicate" : "type",
				"object" : "NamedIndividual"
			}, {
				"subject" : "lance1",
				"predicate" : "temConcorrente",
				"object" : "concorrente1"
			}, {
				"subject" : "lance1",
				"predicate" : "temLeilao",
				"object" : "leilao1"
			}, {
				"subject" : "lance1",
				"predicate" : "timeStamp",
				"object" : "2013/07/15 12:40"
			}, {
				"subject" : "lance1",
				"predicate" : "valor",
				"object" : "30"
			}, {
				"subject" : "Lance",
				"predicate" : "type",
				"object" : "Class"
			}, {
				"subject" : "Lance",
				"predicate" : "type",
				"object" : "Resource"
			}, {
				"subject" : "Lance",
				"predicate" : "subClassOf",
				"object" : "Resource"
			}, {
				"subject" : "Lance",
				"predicate" : "subClassOf",
				"object" : "Lance"
			}, {
				"subject" : "lance2",
				"predicate" : "type",
				"object" : "Resource"
			}, {
				"subject" : "lance2",
				"predicate" : "type",
				"object" : "Lance"
			}, {
				"subject" : "lance2",
				"predicate" : "type",
				"object" : "NamedIndividual"
			}, {
				"subject" : "lance2",
				"predicate" : "temConcorrente",
				"object" : "concorrente2"
			}, {
				"subject" : "lance2",
				"predicate" : "temLeilao",
				"object" : "leilao2"
			}, {
				"subject" : "lance2",
				"predicate" : "timeStamp",
				"object" : "2013/07/15 8:00"
			}, {
				"subject" : "lance2",
				"predicate" : "valor",
				"object" : "100"
			}, {
				"subject" : "lance3",
				"predicate" : "type",
				"object" : "Resource"
			}, {
				"subject" : "lance3",
				"predicate" : "type",
				"object" : "Lance"
			}, {
				"subject" : "lance3",
				"predicate" : "type",
				"object" : "NamedIndividual"
			}, {
				"subject" : "lance3",
				"predicate" : "temConcorrente",
				"object" : "concorrente1"
			}, {
				"subject" : "lance3",
				"predicate" : "temLeilao",
				"object" : "leilao2"
			}, {
				"subject" : "lance3",
				"predicate" : "timeStamp",
				"object" : "2013/07/15 10:00"
			}, {
				"subject" : "lance3",
				"predicate" : "valor",
				"object" : "150"
			}, {
				"subject" : "vendedor3",
				"predicate" : "type",
				"object" : "Resource"
			}, {
				"subject" : "vendedor3",
				"predicate" : "type",
				"object" : "Usuario"
			}, {
				"subject" : "vendedor3",
				"predicate" : "type",
				"object" : "Vendedor"
			}, {
				"subject" : "vendedor3",
				"predicate" : "type",
				"object" : "NamedIndividual"
			}, {
				"subject" : "vendedor3",
				"predicate" : "label",
				"object" : "Vendedor 3"
			}, {
				"subject" : "vendedor3",
				"predicate" : "nomeUsuario",
				"object" : "Vendedor 3"
			}, {
				"subject" : "vendedor3",
				"predicate" : "dataMembroDesde",
				"object" : "23/05/2010"
			}, {
				"subject" : "vendedor3",
				"predicate" : "email",
				"object" : "vendedor3@hotmail.com"
			}, {
				"subject" : "vendedor3",
				"predicate" : "qualificacao",
				"object" : "5"
			}]
		};

		this.isType = function(val) {
			return this.currentWindow.type == val;
		};

		this.changeWindow = function() {
			this.afterExecControl();
			step = {
				currentWindow : this.currentWindow.id,
				//title: this.currentWindow.title, //debug
				selectedOption : this.solution.selectedOption,
				selectedProperties : this.solution.selectedProperties,
				selectedOptions : this.solution.selectedOptions
			};
			this.userSequence.push(step);

			nextValue = this.solution.selectedOption < this.currentWindow.options.length ? this.solution.selectedOption : 0;
			this.selectWindow(this.currentWindow.options[nextValue].next);
			this.solution.selectedOption = 0;
			this.beforeExecControl();

		};

		this.beforeExecControl = function() {
			if (this.isType('attributeForChoosing') || this.isType('attributeForChoosingForDetail')) {
				this.initSelectedOption(this.solution.selectedProperties[0], true);
				this.setModalParameterized(this.selectProperty(this.solution.selectedOption, this.wizard.data[this.currentWindow.example][0], true).name, true);
			} else if (this.isType('computedAttribute')) {
				this.computedAttr_name = "";
			} else if (this.isType('yesNoDetail')) {
				this.solution.selectedProperties = [];
				for (var i = 0; i < this.currentWindow.datatypeProperties.length; i++) {
					for (var j = 0; j < this.wizard.data[this.currentWindow.example][0].length; j++) {
						if (this.wizard.data[this.currentWindow.example][0][j].name == this.currentWindow.datatypeProperties[i])
							this.solution.selectedProperties.push(this.wizard.data[this.currentWindow.example][0][j].id);
					};
				};
			} else if (this.isType('paths')) {
				this.beforeExecutePathsControl();
			}

		};

		this.beforeExecutePathsControl = function() {
			var relatedCollection = this.getRelatedCollectionName(this.userSequence[this.userSequence.length - 1], this.isType('paths'));
			var mainclass = this.getWindow(this.userSequence[this.userSequence.length - 1].currentWindow).mainclass;
			var paths = this.track(mainclass, relatedCollection, this.example, this.isType('paths'));
			this.currentWindow.mainclass = mainclass;
			this.currentWindow.paths = [];
			this.currentWindow.options = [];
			for (var i = 0; i < paths.length; i++) {

				var examples = this.get_path_examples(mainclass, paths[i], this.isType('paths'));
				this.currentWindow.paths.push({
					"key" : i,
					"pathItems" : paths[i],
					"examples" : examples
				});
				this.currentWindow.options.push({
					"key" : i,
					"next" : this.currentWindow.next
				});
			};

			var nextWindow = this.getWindow(this.currentWindow.next);
			// to set the next window with the same examples
			nextWindow.mainclass = mainclass;
			nextWindow.paths = this.currentWindow.paths;
			nextWindow.options = [];
			for (var i = 0; i < nextWindow.paths.length; i++) {
				nextWindow.options.push({
					"key" : i,
					"next" : nextWindow.next
				});
			};
		}

		this.afterExecControl = function() {
			if (this.isType('computedAttribute')) {
				if (this.computedAttr_name != "")
					var temp = this.computedAttr_name;
				this.wizard.data[this.currentWindow.example].forEach(function(entry) {
					entry.push({
						"id" : entry.length,
						"name" : temp,
						"value" : ["Computed " + temp + " attribute"]
					});
				});
				this.solution.selectedProperties.push(this.wizard.data[this.currentWindow.example][0].length - 1);
			} else if (this.isType('loopDetail') || this.isType('loop')) {
				if (this.currentWindow.options[this.solution.selectedOption].text == "Yes") {
					if (this.seqNextNavegation.length == 0)
						this.seqNextNavegation.push(this.currentWindow.options[1].next);
					this.seqNextNavegation.push(this.currentWindow.id);
				} else if (this.seqNextNavegation.length > 0) {
					nextValue = this.solution.selectedOption < this.currentWindow.options.length ? this.solution.selectedOption : 0;
					this.currentWindow.options[nextValue].next = this.seqNextNavegation.pop();
				}
			}
		};

		this.confirmDialog = function(title, msg) {

			var modalOptions = {
				closeButtonText : 'No',
				actionButtonText : 'Yes',
				headerText : title,
				bodyText : msg,
				/*  close: function (result) { //revisar para definir el no
				 console.log("close");
				 /*   	step = {
				 currentWindow: this.currentWindow.id,
				 //title: this.currentWindow.title, //debug
				 selectedOption: this.solution.selectedOption,
				 selectedProperties: this.solution.selectedProperties,
				 selectedOptions: this.solution.selectedOptions
				 };
				 this.userSequence.push(step);
				 this.selectWindow(this.currentWindow.cancelModalNext);
				 this.solution.selectedOption = 0;
				 }*/
			};

			modalService.showModal({}, modalOptions).then(function(result) {
				me.changeWindow();
			});
		};

		this.back = function() {
			if (this.userSequence.length > 0) {
				step = this.userSequence.pop();
				this.selectWindow(step.currentWindow);
				this.solution.selectedOption = step.selectedOption;
				this.solution.selectedProperties = step.selectedProperties;
			}
		};

		this.getWindow = function(id) {
			//	if(index = -1) document.location = "addOntology.html";
			for ( i = 0; i < this.wizard.windows.length; i++) {
				if (this.wizard.windows[i].id == id) {
					return this.wizard.windows[i]
				}
			}
		};

		this.selectWindow = function(id) {

			this.currentWindow = this.getWindow(id);
		};

		this.selectProperty = function(id, arr, canExec) {
			if (arr != null && canExec) {
				for ( i = 0; i < arr.length; i++) {
					if (arr[i].id == id)
						return arr[i];
				}
			}
			return "";
		};

		this.selectPropertyByName = function(name, arr, canExec) {
			if (arr != null && canExec) {
				for ( i = 0; i < arr.length; i++) {
					if (arr[i].name == name)
						return arr[i];
				}
			}
			return "";
		};

		this.getRelatedCollectionName = function(previousWindowInfo, canExec) {
			if (canExec) {
				if (previousWindowInfo) {
					//console.log(previousWindowInfo);
					collectionId = previousWindowInfo.selectedOption;
					previousWindowId = previousWindowInfo.currentWindow;
					return this.getWindow(previousWindowId).options[collectionId].text;
				}
			};
		};

		String.prototype.format = function() {
			var formatted = this;
			for (var i = 0; i < arguments.length; i++) {
				var regexp = new RegExp('\\{' + i + '\\}', 'gi');
				formatted = formatted.replace(regexp, arguments[i]);
			}
			return formatted;
		};

		this.setModalParameterized = function(parameter, isModal) {
			if (isModal) {
				this.currentWindow.modal = this.currentWindow.originalModal ? this.currentWindow.originalModal.format(parameter) : "";
			}
		};

		this.initSelectedOption = function(value, canInitialize) {
			if (canInitialize) {
				console.info(canInitialize);
				this.solution.selectedOption = value;
				console.info(value);
			}
		};

		this.hasResourceDetail = function() {
			return this.isType('yesNoDetail') || this.isType('loopDetail') || this.isType('checkboxForDetail') || this.isType('radioSelectedPropertiesForDetail');
		};

		this.hasSelectedProperty = function() {
			return this.isType('radioSelectedProperties') || this.isType('loop') || this.isType('selectedProperties') || this.isType('checkbox') || this.isType('computedAttribute');
		};

		this.hasDatatypePropertySelection = function() {
			return this.isType('checkbox') || this.isType('checkboxForDetail');
		};

		this.properties = function(classFrom, rdf) {
			var result = [];
			for (var i = 0; i < rdf.definition.length; i++) {
				property = rdf.definition[i];
				for (var j = 0; j < property.domain.length; j++) {
					if (property.domain[j] == classFrom)
						result.push(property);
				};
			};
			return result;
		};

		//----------------------------------------------------------

		this.trackAux = function(classFrom, classTo, current, input, max, rdf) {
			if (max <= 0)
				return;
			var props = this.properties(classFrom, rdf);
			for (var i = 0; i < props.length; i++) {
				var prop = props[i];
				for (var j = 0; j < prop.range.length; j++) {
					_class = prop.range[j];
					current.push({
						"propertyName" : prop.propertyName,
						"className" : _class
					});
					if (_class == classTo) {
						//input.push(current.slice(0));
						this.groupby(input, current);
					}
					this.trackAux(_class, classTo, current, input, max - 1, rdf);
					current.pop();
				}
			}
		};

		this.track = function(classFrom, classTo, rdf, isPath, selectedPath) {
			output = [];
			if (!isPath)
				output.push("This is not a call of a path control");
			if (!rdf)
				output.push("rdf is undefined");
			if (!classFrom)
				output.push("classFrom is undefined");
			if (!classTo)
				output.push("classTo is undefined");
			if (output.length == 0) {
				this.trackAux(classFrom, classTo, [], output, 4, rdf);

				if (selectedPath || selectedPath == 0) {
					return output[selectedPath];
				}
			}
			return output;
		};

		this.isTheSamePath = function(input, current) {
			if (input.length != current.length)
				return false;
			for (var i = 0; i < input.length; i++) {
				if (input[i].className != current[i].className)
					return false;
			}
			return true;
		}

		this.groupby = function(input, current) {
			for (var i = 0; i < input.length; i++) {
				if (this.isTheSamePath(input[i], current)) {
					for (var j = 0; j < input[i].length; j++) {
						if (input[i][j].propertiesNames.indexOf(current[j].propertyName) == -1)
							input[i][j].propertiesNames.push(current[j].propertyName);

					}
					return;
				}
			}
			input.push([]);
			for (var i = 0; i < current.length; i++) {
				input[input.length - 1].push({
					"propertiesNames" : [current[i].propertyName],
					"className" : current[i].className
				});
			}
		};

		//---------------------------------------------------------

		this.get_path_examples = function(initialClass, path, isCallFromValidControl) {

			var result = [];
			var initialInstances = [];
			if (!isCallFromValidControl)
				result.push("This is not a call of a path control");
			else {
				initialInstances = this.get_instances_of_class(initialClass);

				for (var i = 0; i < initialInstances.length; i++) {
					var rest_examples = this.get_rest_of_path_examples(initialInstances[i], path, 0);
					for (var j = 0; j < rest_examples.length; j++) {
						result.push(initialInstances[i] + " - " + rest_examples[j]);
					};
				};
			};

			return result;

		}

		this.get_rest_of_path_examples = function(subject, path, pos) {

			var result = [];

			for (var i = 0; i < path[pos].propertiesNames.length; i++) {
				var prop = path[pos].propertiesNames[i];
				var objects = this.get_objects_from(subject, prop);
				if (pos == path.length - 1) {
					var insts = this.get_instances_of_class(path[path.length - 1].className);

					for (var j = 0; j < objects.length; j++) {
						var obj = objects[j];
						if (insts.indexOf(obj) > -1)
							result.push(prop + " - " + obj);
					};
				} else {
					for (var k = 0; k < objects.length; k++) {
						var obj = objects[k];
						rest_examples = this.get_rest_of_path_examples(obj, path, pos + 1);
						for (var j = 0; j < rest_examples.length; j++) {
							var temp = prop + ":" + rest_examples[j];
							if (temp.split(':').length == path.length - pos)
								result.push(temp);
						};
					};
				}
			}

			return result;
		}

		this.get_instances_of_class = function(className) {
			var result = [];
			triples = me.example.triples;
			for (var i = 0; i < triples.length; i++) {
				if (triples[i].predicate == "type" && triples[i].object == className)
					result.push(triples[i].subject);
			};
			return result;
		}

		this.get_objects_from = function(subject, prop) {
			var result = [];
			triples = me.example.triples;
			for (var i = 0; i < triples.length; i++) {
				if (triples[i].subject == subject && triples[i].predicate == prop)
					result.push(triples[i].object);
			};
			return result;
		}
	}]);

	app.directive('radioNomenclatorChooser', function() {
		return {
			restrict : 'E',
			templateUrl : 'radio-nomenclator-chooser.html'
		};
	});

	app.directive('infoDependingOnSelectedOption', function() {
		return {
			restrict : 'E',
			templateUrl : 'info-depending-on-selected-option.html'
		};
	});

	app.directive('infoToShow', function() {
		return {
			restrict : 'E',
			templateUrl : 'info-to-show.html'
		};
	});

	app.directive('addOntology', function() {
		return {
			restrict : 'E',
			templateUrl : 'add-ontology.html'
		};
	});

	app.directive('selectedProperties', function() {
		return {
			restrict : 'E',
			templateUrl : 'selected-properties.html'
		};
	});

	app.directive('datatypePropertySelection', function() {
		return {
			restrict : 'E',
			templateUrl : 'datatype-property-selection.html'
		};
	});

	app.directive('radioBottomDetail', function() {
		return {
			restrict : 'E',
			templateUrl : 'radio-bottom-detail.html'
		};
	});

	app.directive('computedAttributes', function() {
		return {
			restrict : 'E',
			templateUrl : 'computed-attributes.html',
			controller : function() {

				this.computedAttr_name = "";
			},
			controllerAs : 'computedCtrl'
		};
	});

	app.directive('radioAttributeForChoosing', function() {
		return {
			restrict : 'E',
			templateUrl : 'radio-attribute-for-choosing.html'
		};
	});

	app.directive('resourceDetail', function() {
		return {
			restrict : 'E',
			templateUrl : 'resource-detail.html'
		};
	});

	app.directive('questionOptions', function() {
		return {
			restrict : 'E',
			templateUrl : 'question-options.html'
		};
	});

	app.directive('radioAttributeForChoosingDetail', function() {
		return {
			restrict : 'E',
			templateUrl : 'radio-attribute-for-choosing-detail.html'
		};
	});

	app.directive('selectNomenclatorChooser', function() {
		return {
			restrict : 'E',
			templateUrl : 'select-nomenclator-chooser.html',
			controller : function() {

				this.status = {
					isopen : false
				};

				this.setOption = function(controller, key) {
					controller.solution.selectedOption = key;
					this.status.isopen = !this.status.isopen;
				};

				this.selectOption = function(key, arr) {
					if (arr != null) {
						for ( i = 0; i < arr.length; i++) {
							if (arr[i].key == key)
								return arr[i];
						}
					}
					return "";
				};

			},
			controllerAs : 'chooserCtrl'
		};
	});

	app.directive('selectNomenclatorChooserForPath', function() {
		return {
			restrict : 'E',
			templateUrl : 'select-nomenclator-chooser-for-path.html',
			controller : function() {

				this.status = [];

				this.setOption = function(controller, key, index) {
					controller.solution.selectedOptions[index] = key;
					//console.log(this.status[index]);
					this.status[index] = !this.status[index];
					//console.log(this.status[index]);
				};

				this.selectOption = function(key, arr) {
					if (arr != null) {
						for ( i = 0; i < arr.length; i++) {
							if (arr[i].key == key)
								return arr[i];
						}
					}
					return "";
				};

			},
			controllerAs : 'chooserCtrlPath'
		};
	});

	/* app.controller('WindowsController', ['$http', function($http){
	 this.ontology = "";
	 var step = this;
	 step.currentWindow = [];
	 step.ontology = "";
	 $http.get('../../config/windows.json').success(function(data){
	 step.currentWindow = data[0];
	 });

	 this.isEmpty = function(str){
	 return (!str || 0 === str.length);
	 };
	 }]); */

	app.filter('range', function() {
		return function(input, total) {
			total = parseInt(total);
			for (var i = 0; i < total; i++)
				input.push(i);
			return input;
		};
	});

	app.service('modalService', ['$modal',
	function($modal) {

		var modalDefaults = {
			backdrop : true,
			keyboard : true,
			modalFade : true,
			templateUrl : '/modal'
		};

		var modalOptions = {
			closeButtonText : 'Close',
			actionButtonText : 'OK',
			headerText : 'Proceed?',
			bodyText : 'Perform this action?'
		};

		this.showModal = function(customModalDefaults, customModalOptions) {
			if (!customModalDefaults)
				customModalDefaults = {};
			customModalDefaults.backdrop = 'static';
			return this.show(customModalDefaults, customModalOptions);
		};

		this.show = function(customModalDefaults, customModalOptions) {
			//Create temp objects to work with since we're in a singleton service
			var tempModalDefaults = {};
			var tempModalOptions = {};

			//Map angular-ui modal custom defaults to modal defaults defined in service
			angular.extend(tempModalDefaults, modalDefaults, customModalDefaults);

			//Map modal.html $scope custom properties to defaults defined in service
			angular.extend(tempModalOptions, modalOptions, customModalOptions);

			if (!tempModalDefaults.controller) {
				tempModalDefaults.controller = function($scope, $modalInstance) {
					$scope.modalOptions = tempModalOptions;
					$scope.modalOptions.ok = function(result) {
						$modalInstance.close(result);
					};
					$scope.modalOptions.close = function(result) {
						$modalInstance.dismiss('cancel');
					};
				};
			}

			return $modal.open(tempModalDefaults).result;
		};

	}]);
})();
