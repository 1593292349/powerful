export default class Semver{
	static regExp = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;

	//主版本号
	major:number = 0;
	//次版本号
	minor:number = 0;
	//修订号
	patch:number = 0;
	//先行版本号
	prerelease:string = '';
	//版本编译信息
	metadata:string = '';

	constructor(version:string){
		const match = Semver.regExp.exec(version);
		if(match){
			this.major = parseInt(match[1]);
			this.minor = parseInt(match[2]);
			this.patch = parseInt(match[3]);
			this.prerelease = match[4];
			this.metadata = match[5];
		}
	}
}