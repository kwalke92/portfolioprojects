//	MultiscreenHelp Help 1.0.0
var gsFileName="";
var gsDivName="";
var xmlDoc=null;
var sdocPath=null;
var gsInsertBeforeEndHTML="";
var sReplaceStringsSrc=new Array();
var gsDivName="dataDiv";
var gnLoadDivNum=0;
var xmlHttp=null;
sReplaceStringsSrc[0]="&amp;";
sReplaceStringsSrc[1]="&gt;";
sReplaceStringsSrc[2]="&lt;";
sReplaceStringsSrc[3]="&quot;";
sReplaceStringsSrc[4]=String.fromCharCode(8364);
sReplaceStringsSrc[5]="&nbsp;";

var sReplaceStringsDst=new Array();
sReplaceStringsDst[0]="&";
sReplaceStringsDst[1]=">";
sReplaceStringsDst[2]="<";
sReplaceStringsDst[3]="\"";
sReplaceStringsDst[4]=String.fromCharCode(128);
sReplaceStringsDst[5]=" ";
var goHighLighted=null;

function _getRelativePath(strParentPath,strCurrentPath)
{
	if(_isAbsPath(strCurrentPath)) return _getPath(strCurrentPath);
	strParentPath=_replaceSlash(strParentPath);
	strParentPath=_getPath(strParentPath);
	strCurrentPath=_replaceSlash(strCurrentPath);
	strCurrentPath=_getPath(strCurrentPath);
	for(var i=0;i<strParentPath.length&&i<strCurrentPath.length;i++)
	{
		if(strParentPath.charAt(i)!=strCurrentPath.charAt(i))
			break;
	}
	
	strParentPath=strParentPath.substring(i);
	strCurrentPath=strCurrentPath.substring(i);	
	
	var nPathPos=0;
	while(nPathPos!=-1)
	{
		nPathPos=strParentPath.indexOf("/");
		if(nPathPos!=-1)
		{
			strParentPath=strParentPath.substring(nPathPos+1);
			strCurrentPath="../"+strCurrentPath;
		}
	}
	return strCurrentPath;
}

function _getRelativeFileName(strParentPath,strCurrentPath)
{
	strParentPath=_replaceSlash(strParentPath);
	strParentPath=_getPath(strParentPath);
	strCurrentPath = _replaceSlash(strCurrentPath);
	var lastSlashIdx = 0;
	for(var i=0;i<strParentPath.length&&i<strCurrentPath.length;i++) {
	    if (strParentPath.charAt(i) != strCurrentPath.charAt(i)) {
	        break;
	    }
	    else {
	        if (strParentPath.charAt(i) == '/')
	            lastSlashIdx = i;
	    }
	}

	strParentPath = strParentPath.substring(lastSlashIdx+1);
	strCurrentPath = strCurrentPath.substring(lastSlashIdx+1);	
	
	var nPathPos=0;
	while(nPathPos!=-1)
	{
		nPathPos=strParentPath.indexOf("/");
		if(nPathPos!=-1)
		{
			strParentPath=strParentPath.substring(nPathPos+1);
			strCurrentPath="../"+strCurrentPath;
		}
	}
	return strCurrentPath;
}

function _getFileNameFromPath(strFilePath)
{
	var nPathPos = strFilePath.indexOf("/");
	if(nPathPos != -1)
		return strFilePath.substring(nPathPos+1, strFilePath.length);
	else
		return strFilePath;
}

function _isAbsPathToHost(sPath)
{
	return (sPath.indexOf("/")==0);
}

function _getHost(sPath)
{
	var nPos=sPath.indexOf("//");
	if(nPos>0)
	{
		var nPosx=sPath.indexOf("/",nPos+2);
		if(nPosx>0)
			return sPath.substring(0,nPosx);
		else
			return sPath;
	}
	return sPath;
}

function _getHostNameFromURL(sURL)
{
	var nPos=sURL.indexOf("//");
	if(nPos>0)
	{
		var nPosx=sURL.indexOf("/",nPos+2);
		if(nPosx>0)
			return sURL.substring(nPos+2,nPosx);
		else
			return sURL.substring(nPos, sURL.length);
	}

}

function _getPathFromURL(sURL, aHostName, aPath)
{
	var nPos=sURL.indexOf("//");
	if(nPos>0)
	{
		var nPosx=sURL.indexOf("/",nPos+2);
		if(nPosx>0)
			return sURL.substring(nPosx, sURL.length);
		else
			return "";
	}

}

function _getFullPath(sPath,sRelPath)
{
	if(_isAbsPath(sRelPath))
		return sRelPath;
	else if(_isAbsPathToHost(sRelPath))
		return _getHost(sPath)+sRelPath;
	else if(sRelPath == "./")
		return sPath;
	else
	{
		var nPos=sRelPath.indexOf("./");
		if(nPos==0)
			sRelPath=sRelPath.substring(2, sRelPath.length);
		var sFullPath=sPath;
		var nPathPos=0;
		while(nPathPos!=-1)
		{
			var nPathPos=sRelPath.indexOf("../");
			if(nPathPos!=-1)
			{
				sRelPath=sRelPath.substring(nPathPos+3);
				sFullPath=sFullPath.substring(0,sFullPath.length-1);
				var nPos2=sFullPath.lastIndexOf("/");
				if(nPos2!=-1)
					sFullPath=sFullPath.substring(0,nPos2+1);
				else
					break;
			}
		}
		sFullPath+=sRelPath;
		return sFullPath;
	}	
}

function _getFullPathInAIR( sSwfPath, sRelPath)
{
	var retPath = _getFullPath(_getPath(sSwfPath) , sRelPath);
	var retFile = new window.runtime.flash.filesystem.File(retPath);
	return retFile.nativePath;			
}

function _isAbsPath(strPath)
{
	var strUpper=strPath.toUpperCase();
	return (strUpper.indexOf(":")!=-1||strUpper.indexOf("\\\\")==0);
}

function _replaceSlash(strURL)
{	
	var re=new RegExp("\\\\","g");
	var strReplacedURL=strURL.replace(re,"/");
	return strReplacedURL;
}

function _getPath(strURL)
{
	// remove the search and hash string
	var n=0;
	var n1=strURL.indexOf('#');
	var n2=strURL.indexOf('?');
	if( n1>=0 )
	{
		if( n2>=0 )
				n=(n1>n2)?n2:n1;
		else	n=n1;
	}else
	{
		if( n2>=0 )
				n=n2;
		else	n=strURL.length;
	};
	strURL=strURL.substring(0, n);

	pathpos=strURL.lastIndexOf("/");
	if(pathpos>0)
		return strURL.substring(0,pathpos+1);
	else
		return "";
}

function _isHTTPUrl(strUrl)
{
    strUrl = strUrl.toUpperCase();
    str1 = strUrl.substring(0, 7);
    str2 = strUrl.substring(0, 8);
    if(str1 == "HTTP://" || str1 == "HTTP:\\\\" ||
    str2 == "HTTPS://" || str2 == "HTTPS:\\\\")
        return true;
	else 
	{
	    str3 = strUrl.substring(0, 4);
	    if(str3 == "WWW.")
	        return true;
	}
	return false;
}

function _isRemoteUrl(strUrl)
{
    strUrl = strUrl.toUpperCase();
    if(_isHTTPUrl(strUrl))
	{
		var hostName = document.location.hostname;
		if(hostName != "")
		{
			hostName = hostName.toUpperCase();
			if(strUrl.indexOf(hostName) != -1)
				return false;
			else
				return true;
		}
		return true;
	}

    str1 = strUrl.substring(0, 7);
    if (str1 == "MAILTO:")	return true;
    if (str1 == "TELNET:")	return true;
    if (str1 == "GOPHER:")	return true;
    str1 = strUrl.substring(0, 5);
    if (str1 == "FTP://")	return true;
    if (str1 == "NEWS:")	return true;
    //if (str1 == "FILE:")	return true;
    if (str1 == "FTP:\\\\") return true;

    return false;
}

function removeItemFromArray(oArray,i)
{
	if(oArray.length&&i>=0&&i<oArray.length)
	{
		var len=oArray.length;
		for(var s=i;s<len-1;s++)
			oArray[s]=oArray[s+1];
		oArray.length=len-1;
	}
}

function insertItemIntoArray(oArray,i,obj)
{
	if(oArray.length&&i>=0&&i<=oArray.length)
	{
		var len=oArray.length;
		for(var s=len;s>i;s--)
			oArray[s]=oArray[s-1];
		oArray[i]=obj;		
	}
}

function loadData(sFileName)
{
	var i=gnLoadDivNum;
	var sName=gsDivName+gnLoadDivNum++;
	loadData_2(sFileName,sName);
}

function loadData_2(sFileName,sDivName)
{
	if(!getElement(sDivName))
	{
		if(!insertDataDiv(sDivName))
		{
			gsFileName=sFileName;
			gsDivName=sDivName;
			return;
		}
	}
	var sHTML="";
	if(gbMac)
		sHTML+="<iframe src=\""+sFileName+"\"></iframe>";
	else
		sHTML+="<iframe style=\"visibility:hidden;width:0;height:0\" src=\""+sFileName+"\"></iframe>";
	
	var oDivCon=getElement(sDivName);
	if(oDivCon)
	{
		if(gbNav6)
		{
			if(oDivCon.getElementsByTagName&&oDivCon.getElementsByTagName("iFrame").length>0)
			{
				oDivCon.getElementsByTagName("iFrame")[0].src=sFileName;
			}
			else
				oDivCon.innerHTML=sHTML;
		}
		else
			oDivCon.innerHTML=sHTML;
	}
}

function IsHTTPURL(sdocPath)
{
    var bRetVal = true;
    switch(window.location.protocol)
    {
        case "file:":
            bRetVal = false;
            break;
    }
    return bRetVal;
}

function loadDataXML(sFileName,bAsync)
{
try
{
    var bAsyncReq = true;
    if (bAsync != 'undefined')
        bAsyncReq = bAsync;

    var sCurrentDocPath = _getPath(document.location.href);
    sdocPath = _getFullPath(sCurrentDocPath, sFileName);

    var fileName = _getRelativeFileName(sCurrentDocPath, sdocPath);
    xmlJsReader.loadFile(fileName, function (a_xmlDoc, args) {
        if (a_xmlDoc != null)
            putDataXML(a_xmlDoc, sdocPath);
        else
            onLoadXMLError();
    });
}catch(e)
{
    //Do nothing
	console.log(e.name, ": ", e.message);
}
}

function onXMLResponse()
{
    if(xmlHttp)
    {
      if(xmlHttp.readyState == 4)
      {
        xmlDoc = xmlHttp.responseXML;
        if(xmlDoc!=null)
        {
	        putDataXML(xmlDoc,sdocPath);
	    }
	    else
	    {
	        onLoadXMLError();
	    }
      }
    }
}

function initializeData()
{
	if(xmlDoc!=null)
		putDataXML(xmlDoc,sdocPath);
}

function checkState()
{
	if(xmlDoc!=null)
	{
		var state=xmlDoc.readyState;
		if(state==4)
		{
			// engine version uses xmlhttp, xml data in the responseXML
			if( xmlDoc.responseXML!=null )
				xmlDoc=xmlDoc.responseXML;

			var err=xmlDoc.parseError;
			if(err.errorCode==0)
				putDataXML(xmlDoc,sdocPath);
			else
				onLoadXMLError();
		}
	}
}

function insertDataDiv(sName)
{
	var sHTML="";
	if(gbMac)
		sHTML+="<div id="+sName+" style=\"display:none;\"></div>";
	else
		sHTML+="<div id="+sName+" style=\"visibility:hidden\"></div>";
	if((gbIE5||gbNav6||gbSafari3)&&document.body)
		document.body.insertAdjacentHTML("beforeEnd",sHTML);
	else
	{
		gsInsertBeforeEndHTML=sHTML;
		setTimeout("insertWhenBodyReady();",100);
		return false;
	}
	return true;
}

function insertWhenBodyReady()
{
	if(gsInsertBeforeEndHTML=="") return;
	if(document.body)
	{
		document.body.insertAdjacentHTML("beforeEnd",gsInsertBeforeEndHTML);
		gsInsertBeforeEndHTML="";
		loadData_2(gsFileName,gsDivName);
	}
	else
	{
		setTimeout("insertWhenBodyReady();",100);
	}
}

function window_BUnload()
{
	for(var i=0;i<gnLoadDivNum;i++)
	{
		var oDivCon=getElement(gsDivName+i);
		if(oDivCon)
			oDivCon.innerHTML="";
	}
}

function removeThis(obj)
{
	if(obj.parentNode)
		obj.parentNode.removeChild(obj);
	else
		obj.outerHTML="";
}

function getParentNode(obj)
{
	if(obj.parentNode)
		return obj.parentNode;
	else if(obj.parentElement)
		return obj.parentElement;
	return null;
}

function getElement(sID)
{
	if(document.getElementById)
		return document.getElementById(sID);
	else if(document.all)
		return document.all(sID);
	return null;
}

function getChildrenByTag(obj,sTagName)
{
	if(obj.getElementsByTagName)
	{
		var aChildren=new Array();
		var aElements=getElementsByTag(obj,sTagName);
		if(aElements!=null)
		{
			for(var i=0;i<aElements.length;i++)
			{
				if(aElements[i].parentNode==obj)
					aChildren[aChildren.length]=aElements[i];
			}
			return aChildren;
		}
		else
			return new Array();
	}
	else if(obj.children)
		return obj.children.tags(sTagName);
}

function getElementsByTag(obj,sTagName)
{
	if(obj.getElementsByTagName)
		return obj.getElementsByTagName(sTagName);
	else if(obj.all)
		return obj.all.tags(sTagName);
	return null;
}

function _htmlToText(sHTML)
{
	if(sHTML==null) return null;
	var sText=sHTML;
	for(var i=0;i<sReplaceStringsSrc.length;i++)
	{
		var re=new RegExp(sReplaceStringsSrc[i],"g");
		sText=sText.replace(re,sReplaceStringsDst[i]);
	}	
	return sText;
}

function _textToHtml_nonbsp(sText)
{
	if(sText==null) return null;
	var sHTML=sText;
	for(var i=0;i<sReplaceStringsSrc.length-1;i++)
	{
		var re=new RegExp(sReplaceStringsDst[i],"g");
		sHTML=sHTML.replace(re,sReplaceStringsSrc[i]);
	}	
	return sHTML;
}

function _textToHtml(sText)
{
	if(sText==null) return null;
	var sHTML=sText;
	for(var i=0;i<sReplaceStringsSrc.length;i++)
	{
		var re=new RegExp(sReplaceStringsDst[i],"g");
		sHTML=sHTML.replace(re,sReplaceStringsSrc[i]);
	}	
	return sHTML;
}


function getInnerText(obj)
{
	var renbsp2sp=new RegExp("\xa0","g");
	if(obj.innerText)
	{
		var sText=obj.innerText;
		sText=sText.replace(renbsp2sp," ");
		return sText;
	}
	else
	{
		if(obj.nodeValue)
		{
			var sValue=obj.nodeValue;
			sValue=sValue.replace(renbsp2sp," ");
			return sValue;
		}
		else
		{
			var sText="";
			var oChild=obj.firstChild;
			while(oChild!=null)
			{
				sText+=getInnerText(oChild);
				oChild=oChild.nextSibling;
			}
			return sText;
		}
	}
		
}

function HighLightElement(obj,sHighLightColor,sNormalColor)
{
	if(obj!=null)
	{
		resetHighLight(sNormalColor);
		if (obj.style)
			obj.style.backgroundColor=sHighLightColor;
		goHighLighted=obj;
	}
}

function resetHighLight(sNormalColor)
{
	if(goHighLighted!=null)
	{
		if (goHighLighted.style)
			goHighLighted.style.backgroundColor=sNormalColor;
		goHighLighted=null;
	}
}

function whFont(sName,sSize,sColor,sStyle,sWeight,sDecoration)
{
	this.sName=sName;
	this.sSize=sSize;
	this.sColor=sColor;
	this.sStyle=sStyle;
	this.sWeight=sWeight;
	this.sDecoration=sDecoration;
}

function getFontStyle(oFont)
{
	var sStyle="";
	if(oFont)
	{
		sStyle+="font-family:"+oFont.sName+";";
		sStyle+="font-size:"+oFont.sSize+";";
			
		sStyle+="font-style:"+oFont.sStyle+";";
		sStyle+="font-weight:"+oFont.sWeight+";";
		sStyle+="text-decoration:"+oFont.sDecoration+";";
		sStyle+="color:"+oFont.sColor+";";
	}
	return sStyle;
}

function _browserStringToText(sBStr)
{
	var sText="";
	// change %xxx back to the real char.
	var nPos=sBStr.indexOf('%');
	while(nPos!=-1)
	{
		sText+=sBStr.substring(0,nPos);
		sBStr=sBStr.substring(nPos+1);
		var sNum="";
		var i=0;
		while(sBStr.charAt(i)>='0'&&sBStr.charAt(i)<='9')
		{
			sNum+=sBStr.charAt(i++);	
		}
		if(sNum!=""){
			var nNum=parseInt(sNum,16);
			sText+=String.fromCharCode(nNum);
			sBStr=sBStr.substring(i);
		}
		nPos=sBStr.indexOf('%');
	}
	sText+=sBStr;
	return sText;
}

function IsInternal(urlName)
{
	if(urlName.indexOf(":") == -1 && urlName.indexOf("&#58;")== -1 && urlName.indexOf("//") != 0 && 
			urlName.indexOf("/&#47;") != 0 && urlName.indexOf("&#47;/") != 0 && urlName.indexOf("&#47;&#47;") != 0)
		return true;
	else
		return false;
}

function IsNonAscii(szWord)
{
    var temp;
    for(var iCount=0; iCount<szWord.length;iCount++)
    {
        temp = szWord.charCodeAt(iCount);
        if(temp>128)
            return true;
    }
    return false;

}

function excapeSingleQuotandSlash(str)
{
	if(str==null) return null;
	var nPos=0;
	var sRes="";
	var nPosNew=str.indexOf("\\",nPos);
	while(nPosNew!=-1){
		sRes+=str.substring(nPos,nPosNew+1)+"\\";
		nPos=nPosNew+1;
		nPosNew=str.indexOf("\\",nPos);
	}
	if(nPos<str.length)
		sRes+=str.substring(nPos);
	var re=new RegExp("'","g");
	sRes=sRes.replace(re,"\\'");
	return sRes;
}


function    getClientHeight()
{
    if(gbSafari3)
    {
        return innerHeight;   //this is for safari
    }
    return document.body.clientHeight;
    
}

function PatchParametersForEscapeChar(sParam)
{
	var sresult = sParam;
	if(gbSafari)
	{
		sresult = sresult.replace(/%3c/gi,"<");
		sresult = sresult.replace(/%3e/gi,">");
	}
	return sresult;
}

var gbWhUtil=true;
