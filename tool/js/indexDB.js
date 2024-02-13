
/**
* @author 穆仁超
* indexeddb框架
* 日期 2014-12-28
* modify data : 2015-09-10
* Email : murenchao@126.com
*/ 
function fw4wdb(database,version,columns){
	'user strict';

	var 
	console={
		log:function(){}
	};
	return new (function(database,version,columns){

		var 
		indexedDB = window.indexedDB || window.mozIndexeDB || window.webkitIndexedDB || window.msIndexedDB,
		IDBTransaction = window.IDBTransaction || window.webKitIDBTransaction || window.msIDBTransaction,
		IDBKeyRange = window.IDBKeyRange || window.webKitIDBKeyRange || window.msIDBKeyRange,
		_callback={
			'name':database,
			'db':undefined,
			'sort':'next',
			'close':function(){
				this.db.close();
			},
			'add':function(value){
				var 
				objectStore = this.db.transaction(this.name,'readwrite').objectStore(this.name);
				objectStore.oncomplete=function(event){
				
				};
				objectStore.onerror=function(event){
					console.error('transaction:',event.target.errorCode);
				};
				objectStore.add(value);
			},
			'addAll':function(values){
				var 
				objectStore = this.db.transaction(this.name,'readwrite').objectStore(this.name);
				objectStore.oncomplete=function(event){
				
				};
				objectStore.onerror=function(event){
					console.error('transaction:',event.target.errorCode);
				};
				var 
				len = values.length;
				for(var i=0;i<len;i++){
					objectStore.add(values[i]);
				}
			},
			'putAll':function(values){
				var 
				objectStore = this.db.transaction(this.name,'readwrite').objectStore(this.name);
				objectStore.oncomplete=function(event){
				
				};
				objectStore.onerror=function(event){
					console.error('transaction:',event.target.errorCode);
				};
				var 
				len = values.length;
				for(var i=0;i<len;i++){
					objectStore.put(values[i]);
				}
			},
			'put':function(value){
				var 
				objectStore = this.db.transaction(this.name,'readwrite').objectStore(this.name);
				objectStore.put(value);
				objectStore.oncomplete=function(event){
				
				};
				objectStore.onerror=function(event){
					console.error('transaction:',event.target.errorCode);
				};
			},
			'each':function(callback){
				var 
				objectStore = this.db.transaction(this.name,'readonly').objectStore(this.name);
				IDBKeyRange.NEXT = this.sort;

				objectStore.openCursor(null,IDBKeyRange.NEXT).onsuccess=function(event){
					var 
					cursor = event.target.result;

					if(callback == undefined || typeof callback != 'function')
						return;

					if(!cursor)
						return;
					
					callback(cursor.value);
					cursor.continue();
				};
			},
			'getAll':function(callback){
				var 
				objectStore = this.db.transaction(this.name,'readonly').objectStore(this.name);
				var 
				datas = [];
				IDBKeyRange.NEXT = this.sort;

				objectStore.openCursor(null,IDBKeyRange.NEXT).onsuccess=function(event){
					var 
					cursor = event.target.result;
					if(!cursor){
						if(callback == undefined || typeof callback != 'function') 
							return;

						callback(datas);
						return;
					}
					datas.push(cursor.value);
					cursor.continue();
				};//end onsuccess
			}, 
			'get':function(key,callback){
				var 
				objectStore = this.db.transaction(this.name,'readonly').objectStore(this.name);
				objectStore.get(key).onsuccess=function(event){

					if(callback == undefined || typeof callback != 'function')
						return;

					callback(event.target.result);
				};
			},
			'range':function(column,callback){
				/************
				e-> key e1
				e1 -> >|< num t |$
				t -> & e1 | $
				************
				keys>1&<10
				************/
				console.log(column);
				var 
				i = 0;

				var 
				getChar=function(){
					if(column.length >= i)
					return column[i++];
				};
				var 
				getCol = function(){
					var 
					val = getChar(),
					s = '';
					if(val>='a'&&val<='z'||val>='A'&&val<='Z'){
						do{
							s+=val;
							val=getChar();
						}while(val>='a'&&val<='z'||val>='A'&&val<='Z');
						i--;
					}
					console.log(s);
					return s
				};
				var getVal = function(){
					var 
					val = getChar();
					var 
					s = '';
					do{
						s+= val;
						val=getChar();
					}while(val != '&' && i <= column.length);
					console.log('val',s);
					return s
				};
				var 
				objectStore = this.db.transaction(this.name,'readonly').objectStore(this.name);
				var 
				index = objectStore.index(getCol());
				sym = getChar();

				console.log(sym);

				var range = undefined;
				switch(sym){
				case '>':/*>=*/
					if(getChar() == '='){
						range = IDBKeyRange.lowerBound(getVal());
					}else{
						i--;
						range = IDBKeyRange.lowerBound(getVal(),true);
					}
					i--;
					s = getChar();
					if(s == '&'){
						getChar();
						if(range!=undefined && typeof range === 'object'){
							if(getChar() == '='){
								range=IDBKeyRange.bound(range.lower,getVal(),range.lowerOpen,false);
							}else{
								i--;
								range=IDBKeyRange.bound(range.lower,getVal(),range.lowerOpen,true);
							}
						}
					}
					break;
				case '<': /*<=*/
					if(getChar() == '='){
						range = IDBKeyRange.upperBound(getVal());
					}else{
						i--;
						range = IDBKeyRange.upperBound(getVal(),true);
					}
					i--;
					s = getChar();
					if(s == '&'){
						getChar();
						if(range!=undefined && typeof range === 'object'){
							if(getChar() == '='){
								range=IDBKeyRange.bound(getVal(),range.upper,false,range.upperOpen);
							}else{
								i--;
								range=IDBKeyRange.bound(getVal(),range.upper,true,range.upperOpen);
							}
						}
					}
					break;
				case '=':
					range = IDBKeyRange.only(getVal());
					break;
				}

				console.log(range);

				IDBKeyRange.NEXT = this.sort;

				index.openCursor(range,IDBKeyRange.NEXT).onsuccess=function(event){
					var 
					cursor = event.target.result;
					if(callback == undefined || typeof callback != 'function')
						return;

					if(!cursor) 
						return;

					callback(cursor.value);
					cursor.continue();
				}
			},
			'delete':function(key){
				var 
				request = this.db.transaction(this.name,'readwrite').objectStore(this.name);
				request.delete(key);

				request.onsuccess = function(event){
					console.log('delete success');
				};
			},
			'clear':function(){
				var 
				request = this.db.transaction(this.name,'readwrite').objectStore(this.name);
				request.clear();
				request.onsuccess = function(event){
					console.log('clear success');
				};
			}
		};
		//////////////////////////////////////////////////////////////////////////////////////////////////////
		this.deleteDB=function(){
			indexedDB.deleteDatabase(database);
		},
		this.open = function(callback){
			if(!indexedDB){
				return alert('Your browser doesn\'t support a stable version of IndexedDB');
			}

			console.log('indexedDB open success');
			var 
			request;

			if(version!=undefined && typeof version === 'number')
				request = indexedDB.open(database,version);
			else
				request = indexedDB.open(database);

			request.onerror=function(event){
				console.log(database,'error',event);
			};
			request.onblocked=function(event){
				console.log('Please close all other tabs with this site open!');
			};
			request.onsuccess=function(event){
				if(callback!=undefined && typeof callback === 'function'){
					_callback.db = this.result;
					callback(_callback);
				}
				//this.result.close();
			};
			request.onupgradeneeded = function(event){
				/********
				{
				keyPath:'id',
				index:[{email:{unique:true}}]
				}
				********/
				console.log('create table');
				var 
				keyPath = {autoIncrement:true};
				if(columns != undefined && columns.key != undefined){
					keyPath = {'keyPath':columns.key};
				}
				var 
				store = event.currentTarget.result.createObjectStore(database,keyPath);
				
				if(columns != undefined && columns.index != undefined){
					var 
					index = columns.index;
					for(var i=0;i<index.length;i++){
						var 
						j = index[i];
						for(var field in j){
							console.log(field,j[field]);
							store.createIndex(field,field,j[field]);
						}
					}
				}
			};
		};

	})(database,version,columns);
}




const db=fw4wdb;
db._wrapper=function(){
	var
	db,
	open=onConnect=>{
		if(db){
			onConnect(db)
		}else{
			this.open(_db=>{
				db=_db;
				onConnect(db);
				// db.close();
			});
		}
	};

	return {
		set:(data)=>{
			open(db=>{
				db.put(data);
			});
		},
		get:(id,onLoad)=>{
			open(db=>{
				db.get(id,onLoad)
			})
		},
		getAll:onLoad=>{
			open(db=>{
				db.getAll(onLoad);
			})
		},
		delete:()=>{
			this.deleteDB();
		}
	}
};

