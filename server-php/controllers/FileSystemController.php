<?php

function human_filesize($bytes, $decimals = 2) {
  $sz = 'BKMGTP';
  $factor = floor((strlen($bytes) - 1) / 3);
  return sprintf("%.{$decimals}f", $bytes / pow(1024, $factor)) . @$sz[$factor];
}

class FileSystemController{

	function listFiles($dir){
		if($dir == ""){
			$dir = "/";
		}

		//error_log("DIR: $dir", 3, "/tmp/tools_logs.log");

		$arr = scandir($dir);
		$files = array();
		foreach($arr as $entry){

			if($entry == '.'
			       || $entry == '..'){
				continue;
			}

			$fileUrl = $dir."/".$entry;
			$fileUrl = preg_replace("/\/+/", "/", $fileUrl); //delete extra slashes
			$fileInfo = pathinfo($fileUrl);

			if(is_dir($fileUrl)){
				$folder = array(
					"name" => $fileInfo['basename'],
					"url" => $fileUrl,
					"extension" => "folder",
					"size" => 0,
					"last_update" => date ("F d Y H:i:s.", filemtime($fileUrl))
				);
				array_push($files, $folder);
				continue;
			}

			$file = array(
				"name" => $fileInfo['basename'],
				"url" => $fileUrl,
				"extension" => array_key_exists('extension', $fileInfo) ? $fileInfo['extension'] : "file",
				"size" => human_filesize(filesize($fileUrl)),
				"last_update" => date ("F d Y H:i:s.", filemtime($fileUrl))
			);
			array_push($files, $file);
		}
		echo json_encode($files);
	}

	function rename($currentFile, $newName) {
		try{
			$fileInfo = pathinfo($currentFile);
			$dir = $fileInfo["basedir"];
			$newFile = $dir."/".$currentFile;
			rename($currentFile, $newFile);
		}catch(Exception $e){
			error_log("rename file: $e", 3, "/tmp/tools_logs.log");
			return false;
		}
		return true;
	}

	function delete($fileUrl) {
		try{
			if(!file_exists($fileUrl)){
				throw new Exception('File does not exists');
			}
			if(is_dir($fileUrl)){
				rmdir($fileUrl);
			}else{
				unlink($fileUrl);
			}
		}catch(Exception $e){
			error_log("delete file: $e", 3, "/tmp/tools_logs.log");
			return false;
		}
		return true;
	}

}

?>
